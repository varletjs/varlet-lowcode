import {
  defineComponent,
  h,
  ref,
  isRef,
  unref,
  toRefs,
  isProxy,
  isReactive,
  isReadonly,
  reactive,
  computed,
  readonly,
  watch,
  watchEffect,
  watchSyncEffect,
  watchPostEffect,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  withDirectives,
  Fragment,
} from 'vue'
import { assetsManager, BuiltInSchemaNodeNames, schemaManager, SchemaPageNodeDataSource } from '@varlet/lowcode-core'
import { isArray, isObject, isPlainObject, isString } from '@varlet/shared'
import { exec } from './exec'
import { Drag, DragOver, Drop } from '@varlet/lowcode-dnd'
import { createAxle } from '@varlet/axle'
import { Snackbar } from '@varlet/ui'
import '@varlet/ui/es/snackbar/style/index'
import './renderer.less'

import type { PropType, VNode, DirectiveArguments } from 'vue'
import type { SchemaPageNode, SchemaNode, SchemaTextNode, EventsManager, Assets } from '@varlet/lowcode-core'

declare const window: Window & {
  setup(): any
  $slotProps?: Record<string, any>
  $renderArgs?: Record<string, any[]>
  $item?: Record<string, any>
  $index?: Record<string, any>
}

type RawSlots = {
  [name: string]: unknown
}

type RawProps = Record<string, any>

interface RendererDataSource {
  value: any

  load(params?: Record<string, any>, headers?: Record<string, any>): Promise<any>
}

type RendererDataSources = Record<string, RendererDataSource>

const axle = createAxle({})

function createDataSources(schemaDataSources: SchemaPageNodeDataSource[]) {
  function useDataSources() {
    return schemaDataSources.reduce(
      (rendererDataSources, { name, url, method, headers, timeout, withCredentials, successHandler, errorHandler }) => {
        const load = async (params?: Record<string, any>, options?: Record<string, any>) => {
          try {
            const response = await axle.helpers[method](url, params, {
              ...options,
              headers,
              timeout,
              withCredentials,
            })

            const successHandlerFunction = schemaManager.isExpressionBinding(successHandler)
              ? exec(`(${successHandler.compatibleValue ?? successHandler.value})`)
              : undefined

            const value = await (successHandlerFunction?.(response) ?? response)

            rendererDataSource.value = value

            return value
          } catch (e: any) {
            const errorHandlerFunction = schemaManager.isExpressionBinding(errorHandler)
              ? exec(`(${errorHandler.compatibleValue ?? errorHandler.value})`)
              : undefined

            return errorHandlerFunction?.(e) ?? e
          }
        }

        const rendererDataSource = reactive({
          value: undefined,
          load,
        })

        rendererDataSources[name] = rendererDataSource

        return rendererDataSources
      },
      {} as RendererDataSources
    )
  }

  return useDataSources
}

export default defineComponent({
  name: 'VarletLowCodeRenderer',

  props: {
    mode: {
      type: String as PropType<'designer' | 'render'>,
      default: 'render',
    },

    schema: {
      type: Object as PropType<SchemaPageNode>,
      required: true,
      default: () => ({}),
    },

    assets: {
      type: Array as PropType<Assets>,
      required: true,
      default: () => [],
    },

    designerEventsManager: {
      type: Object as PropType<EventsManager>,
    },
  },

  setup(props) {
    const hoistedApis: string[] = []
    const builtInApis = {
      h,
      ref,
      reactive,
      computed,
      readonly,
      watch,
      watchEffect,
      watchSyncEffect,
      watchPostEffect,
      isRef,
      unref,
      toRefs,
      isProxy,
      isReactive,
      isReadonly,
      onBeforeMount,
      onMounted,
      onBeforeUpdate,
      onUpdated,
      onBeforeUnmount,
      onUnmounted,
      axle,
      useDataSources: createDataSources(props.schema.dataSources ?? []),
    }

    hoistWindow(builtInApis)

    const code = props.schema.compatibleCode ?? props.schema.code ?? 'function setup() { return {} }'
    const setup = exec(code)
    const ctx = setup()

    function mountCss() {
      if (!props.schema.css) {
        return
      }

      const style = document.createElement('style')
      style.innerHTML = props.schema.css
      style.id = 'varlet-low-code-css'

      document.head.appendChild(style)
    }

    function unmountCss() {
      const style = document.querySelector('#varlet-low-code-css')

      if (style) {
        document.head.removeChild(style)
      }
    }

    function setDndDisabledStyle() {
      const styles = document.createElement('style')
      const styleSheet = `
      .varlet-low-code--disable-events > * {
        pointer-events: none;
      }

      .varlet-low-code--disable-events {
        pointer-events: all;
      }
      `

      styles.id = `varlet-low-code-events`
      styles.innerHTML = styleSheet

      document.body.appendChild(styles)
    }

    function uninstallDndDisabledStyle() {
      const styles = document.querySelector('#varlet-low-code-events')

      styles && document.body.removeChild(styles)
    }

    function cloneSchemaNode(schemaNode: SchemaNode) {
      return JSON.parse(JSON.stringify(schemaNode))
    }

    function hoistWindow(apis: any) {
      Object.keys(apis).forEach((name: string) => {
        if (name in window) {
          throw new Error(`Property [${name}] is the built-in api of window, please replace the property name`)
        }

        Object.assign(window, { [name]: apis[name] })
        hoistedApis.push(name)
      })
    }

    function restoreWindow() {
      hoistedApis.forEach((name) => {
        Reflect.deleteProperty(window, name)
      })
    }

    function hasScopedVariables(expression: string) {
      return ['$item', '$index', '$slotProps', '$renderArgs'].some((scopedVariable) =>
        expression.includes(scopedVariable)
      )
    }

    function resolveScopedExpression(expression: string, schemaNode: SchemaNode, renderArgs?: any, slotProps?: any) {
      window.$item = schemaNode._item
      window.$index = schemaNode._index
      window.$slotProps = slotProps
      window.$renderArgs = renderArgs

      const resolved = exec(expression)

      delete window.$item
      delete window.$index
      delete window.$slotProps
      delete window.$renderArgs

      return resolved
    }

    function getExpressionBindingValue(
      expression: string,
      schemaNode: SchemaNode,
      renderArgs?: any,
      extendSlotProps?: any
    ) {
      if (!hasScopedVariables(expression)) {
        return exec(`(${expression})`)
      }

      return resolveScopedExpression(expression, schemaNode, renderArgs, extendSlotProps)
    }

    function getObjectBindingValue(value: any, schemaNode: SchemaNode, renderArgs?: any, slotProps?: any) {
      return Object.keys(value).reduce((newValue, key) => {
        newValue[key] = getBindingValue(value[key], schemaNode, renderArgs, slotProps)

        return newValue
      }, {} as Record<string, any>)
    }

    function getBindingValue(value: any, schemaNode: SchemaNode, renderArgs?: any, slotProps?: any): any {
      if (schemaManager.isRenderBinding(value)) {
        return (...args: any[]) => {
          extendLoopScopedVariables(value.value, schemaNode)
          const conditionedSchemaNodes = withCondition(value.value, renderArgs, slotProps)
          const loopedSchemaNodes = withLoop(conditionedSchemaNodes, schemaNode, renderArgs, slotProps)

          const _renderArgs = {
            ...renderArgs,
            [value.renderId!]: args,
          }

          return h(
            Fragment,
            loopedSchemaNodes.map((schemaNodeChild: SchemaNode) => {
              return renderSchemaNode(schemaNodeChild, _renderArgs, slotProps)
            })
          )
        }
      }

      if (schemaManager.isExpressionBinding(value)) {
        return getExpressionBindingValue(value.compatibleValue ?? value.value, schemaNode, renderArgs, slotProps)
      }

      if (schemaManager.isObjectBinding(value)) {
        return getObjectBindingValue(value, schemaNode, renderArgs, slotProps)
      }

      if (isArray(value)) {
        return value.map((item) => getBindingValue(item, schemaNode, renderArgs, slotProps))
      }

      return value
    }

    function getComponent(schemaNodeName: string, schemaNodeLibrary: string) {
      return assetsManager.findComponent(props.assets, schemaNodeName, schemaNodeLibrary)
    }

    function getPropsBinding(schemaNode: SchemaNode, renderArgs?: any, slotProps?: any) {
      const rawProps = Object.entries(schemaNode.props ?? {}).reduce((rawProps, [key, value]) => {
        rawProps[key] = getBindingValue(value, schemaNode, renderArgs, slotProps)

        return rawProps
      }, {} as RawProps)

      const clickEvent = rawProps.onClick

      rawProps.id = `dragItem${schemaNode.id}`
      props.mode === 'designer' &&
        (rawProps.onClick = (...arg: any) => {
          console.log('123123123')

          props.designerEventsManager!.emit('selector', `dragItem${schemaNode.id}` || '')

          clickEvent && clickEvent(...arg)
        })

      return rawProps
    }

    function withDesigner(schemaNode: SchemaNode, renderArgs?: any, slotProps?: any) {
      const propsBinding = getPropsBinding(schemaNode, renderArgs, slotProps)

      const classes = isArray(propsBinding.class)
        ? propsBinding.class
        : isString(propsBinding.class)
        ? propsBinding.class.split(' ')
        : []

      if (props.mode !== 'designer') {
        return h(
          getComponent(schemaNode.name, schemaNode.library!),
          { ...propsBinding, class: classes },
          renderSchemaNodeSlots(schemaNode, renderArgs, slotProps)
        )
      }

      const directives: DirectiveArguments = [
        [Drag, { dragData: schemaNode, eventsManager: props.designerEventsManager }],
        [Drop, { eventsManager: props.designerEventsManager }],
      ]

      classes.push('varlet-low-code--disable-events')

      return withDirectives(
        h(
          getComponent(schemaNode.name, schemaNode.library!),
          { ...propsBinding, class: classes },
          renderSchemaNodeSlots(schemaNode, renderArgs, slotProps)
        ),
        directives
      )
    }

    function withCondition(schemaNodes: SchemaNode[], renderArgs?: any, slotProps?: any): SchemaNode[] {
      return schemaNodes.filter((schemaNode) =>
        Boolean(getBindingValue(schemaNode.if ?? true, schemaNode, renderArgs, slotProps))
      )
    }

    function withLoop(
      schemaNodes: SchemaNode[],
      parentSchemaNode: SchemaNode,
      renderArgs?: any,
      slotProps?: any
    ): SchemaNode[] {
      const flatSchemaNodes: SchemaNode[] = []

      schemaNodes.forEach((schemaNode) => {
        if (!schemaNode.hasOwnProperty('for')) {
          flatSchemaNodes.push(schemaNode)
          return
        }

        let items: any = getBindingValue(schemaNode.for, schemaNode, renderArgs, slotProps)

        if (!isArray(items)) {
          items = Array.from({ length: Number(items) || 0 }, (_, index) => index + 1)
        }

        ;(items as any[]).forEach((item, index) => {
          const newSchemaNode = cloneSchemaNode(schemaNode)

          if (!newSchemaNode._item) {
            newSchemaNode._item = {}
          }

          if (!newSchemaNode._index) {
            newSchemaNode._index = {}
          }

          newSchemaNode._item[newSchemaNode.id] = item
          newSchemaNode._index[newSchemaNode.id] = index

          flatSchemaNodes.push(newSchemaNode)
        })
      })

      return flatSchemaNodes
    }

    function renderSchemaNode(schemaNode: SchemaNode, renderArgs?: any, slotProps?: any): VNode | string {
      if (schemaNode.name === BuiltInSchemaNodeNames.TEXT) {
        const textContent = getBindingValue(
          (schemaNode as SchemaTextNode).textContent,
          schemaNode,
          renderArgs,
          slotProps
        )

        return isObject(textContent) ? JSON.stringify(textContent) : (textContent ?? '').toString()
      }

      return withDesigner(schemaNode, renderArgs, slotProps)
    }

    function extendLoopScopedVariables(schemaNodes: SchemaNode[], parentSchemaNode: SchemaNode) {
      schemaNodes.forEach((schemaNode) => {
        if (parentSchemaNode._item) {
          schemaNode._item = parentSchemaNode._item
        }

        if (parentSchemaNode._index) {
          schemaNode._index = parentSchemaNode._index
        }
      })
    }

    function renderSchemaNodeSlots(schemaNode: SchemaNode, renderArgs?: any, extendSlotProps?: any): RawSlots {
      try {
        if (!isPlainObject(schemaNode.slots)) {
          return {}
        }

        return Object.entries(schemaNode.slots).reduce((rawSlots, [slotName, slot]) => {
          rawSlots[slotName] = (slotProps: any) => {
            const _slotProps = {
              ...extendSlotProps,
              [schemaNode.id!]: slotProps,
            }

            const slotChildren = slot.children ?? []

            slotChildren.forEach((schemaNodeChild) => {
              if (schemaNode._item) {
                schemaNodeChild._item = schemaNode._item
              }

              if (schemaNode._index) {
                schemaNodeChild._index = schemaNode._index
              }
            })

            extendLoopScopedVariables(slotChildren, schemaNode)
            const conditionedSchemaNodes = withCondition(slotChildren, renderArgs, _slotProps)
            const loopedSchemaNodes = withLoop(conditionedSchemaNodes, schemaNode, renderArgs, _slotProps)

            return loopedSchemaNodes.map((schemaNodeChild) => renderSchemaNode(schemaNodeChild, renderArgs, _slotProps))
          }

          return rawSlots
        }, {} as RawSlots)
      } catch (e) {
        Snackbar.error('Renderer error, please check console')
        throw e
      }
    }

    hoistWindow(ctx)
    setDndDisabledStyle()

    onMounted(mountCss)

    onUnmounted(() => {
      uninstallDndDisabledStyle()
      restoreWindow()
      unmountCss()
    })

    return () =>
      props.mode === 'designer'
        ? [
            withDirectives(
              h(
                'div',
                { class: 'varlet-low-code-renderer varlet-low-code-renderer__designer', mode: props.mode },
                renderSchemaNodeSlots(props.schema)
              ),
              [
                [Drop, { eventsManager: props.designerEventsManager }],
                [DragOver, { eventsManager: props.designerEventsManager }],
              ]
            ),
          ]
        : h('div', { class: 'varlet-low-code-renderer' }, renderSchemaNodeSlots(props.schema))
  },
})
