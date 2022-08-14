import {
  defineComponent,
  h,
  renderList,
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
  $item?: Record<string, any>
  $index?: Record<string, any>
  $slotProps?: Record<string, any>
  $renderArgs?: Record<string, any[]>
}

interface ScopeVariables {
  $item?: Record<string, any>
  $index?: Record<string, any>
  $slotProps?: Record<string, any>
  $renderArgs?: Record<string, any[]>
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

    function createNewScopeVariables(oldScopeVariables: ScopeVariables, partialScopeVariables: ScopeVariables) {
      return {
        ...oldScopeVariables,
        ...partialScopeVariables,
      }
    }

    function includesScopeVariable(expression: string) {
      return ['$item', '$index', '$slotProps', '$renderArgs'].some((scopedVariable) =>
        expression.includes(scopedVariable)
      )
    }

    function resolveScopedExpression(expression: string, scopeVariables: ScopeVariables) {
      window.$item = scopeVariables.$item
      window.$index = scopeVariables.$index
      window.$slotProps = scopeVariables.$slotProps
      window.$renderArgs = scopeVariables.$renderArgs

      const resolved = exec(expression)

      delete window.$item
      delete window.$index
      delete window.$slotProps
      delete window.$renderArgs

      return resolved
    }

    function getExpressionBindingValue(expression: string, scopeVariables: ScopeVariables) {
      if (!includesScopeVariable(expression)) {
        return exec(expression)
      }

      return resolveScopedExpression(expression, scopeVariables)
    }

    function getObjectBindingValue(value: any, scopeVariables: ScopeVariables) {
      return Object.keys(value).reduce((newValue, key) => {
        newValue[key] = getBindingValue(value[key], scopeVariables)

        return newValue
      }, {} as Record<string, any>)
    }

    function getBindingValue(value: any, scopeVariables: ScopeVariables): any {
      if (schemaManager.isRenderBinding(value)) {
        return (...args: any[]) => {
          const newScopeVariables = createNewScopeVariables(scopeVariables, {
            $renderArgs: {
              ...scopeVariables.$renderArgs,
              [value.renderId!]: args,
            },
          })

          const conditionedSchemaNodes = withCondition(value.value, newScopeVariables)

          return h(
            Fragment,
            conditionedSchemaNodes.map((schemaNode) => renderSchemaNode(schemaNode, newScopeVariables))
          )
        }
      }

      if (schemaManager.isVNodeBinding(value)) {
        const condition = getBindingValue(value.value.if, scopeVariables) ?? true

        return condition ? renderSchemaNode(value.value, scopeVariables) : undefined
      }

      if (schemaManager.isExpressionBinding(value)) {
        return getExpressionBindingValue(value.compatibleValue ?? value.value, scopeVariables)
      }

      if (schemaManager.isObjectBinding(value)) {
        return getObjectBindingValue(value, scopeVariables)
      }

      if (isArray(value)) {
        return value.map((value) => getBindingValue(value, scopeVariables))
      }

      return value
    }

    function getComponent(schemaNodeName: string, schemaNodeLibrary: string) {
      return assetsManager.findComponent(props.assets, schemaNodeName, schemaNodeLibrary)
    }

    function getPropsBinding(schemaNode: SchemaNode, scopeVariables: ScopeVariables) {
      const rawProps = Object.entries(schemaNode.props ?? {}).reduce((rawProps, [key, value]) => {
        rawProps[key] = getBindingValue(value, scopeVariables)

        return rawProps
      }, {} as RawProps)

      rawProps.id = `dragItem${schemaNode.id}`

      return rawProps
    }

    function withDesigner(schemaNode: SchemaNode, scopeVariables: ScopeVariables) {
      const propsBinding = getPropsBinding(schemaNode, scopeVariables)
      const classes = isArray(propsBinding.class)
        ? propsBinding.class
        : isString(propsBinding.class)
        ? propsBinding.class.split(' ')
        : []

      if (props.mode !== 'designer') {
        return h(
          getComponent(schemaNode.name, schemaNode.library!),
          { ...propsBinding, class: classes },
          renderSchemaNodeSlots(schemaNode, scopeVariables)
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
          renderSchemaNodeSlots(schemaNode, scopeVariables)
        ),
        directives
      )
    }

    function withCondition(schemaNodes: SchemaNode[], scopeVariables: ScopeVariables): SchemaNode[] {
      return schemaNodes.filter((schemaNode) => !!getBindingValue(schemaNode.if ?? true, scopeVariables))
    }

    function renderVNode(schemaNode: SchemaNode, scopeVariables: ScopeVariables): VNode {
      if (!schemaNode.hasOwnProperty('for')) {
        return withDesigner(schemaNode, scopeVariables)
      }

      const bindingValue = getBindingValue(schemaNode.for, scopeVariables)

      return h(
        Fragment,
        null,
        renderList(bindingValue, (item, index) => {
          const clonedSchemaNode = schemaManager.cloneSchemaNode(schemaNode)

          return withDesigner(
            clonedSchemaNode,
            createNewScopeVariables(scopeVariables, {
              $item: {
                ...scopeVariables.$item,
                [schemaNode.id!]: item,
              },
              $index: {
                ...scopeVariables.$index,
                [schemaNode.id!]: index,
              },
            })
          )
        })
      )
    }

    function renderSchemaNode(schemaNode: SchemaNode, scopeVariables: ScopeVariables): VNode | string {
      if (schemaNode.name === BuiltInSchemaNodeNames.TEXT) {
        const textContent = getBindingValue((schemaNode as SchemaTextNode).textContent, scopeVariables)

        return isObject(textContent) ? JSON.stringify(textContent) : (textContent ?? '').toString()
      }

      return renderVNode(schemaNode, scopeVariables)
    }

    function renderSchemaNodeSlots(schemaNode: SchemaNode, scopeVariables: ScopeVariables): RawSlots {
      try {
        if (!isPlainObject(schemaNode.slots)) {
          return {}
        }

        return Object.entries(schemaNode.slots).reduce((rawSlots, [slotName, slot]) => {
          rawSlots[slotName] = (slotProps: any) => {
            const newScopeVariables = createNewScopeVariables(scopeVariables, {
              $slotProps: {
                ...scopeVariables.$slotProps,
                [schemaNode.id!]: slotProps,
              },
            })

            return withCondition(slot.children ?? [], newScopeVariables).map((schemaNode) =>
              renderSchemaNode(schemaNode, newScopeVariables)
            )
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
        ? withDirectives(
            h(
              'div',
              {
                style: 'min-height:100vh',
                class: 'varlet-low-code-renderer varlet-low-code-renderer__designer',
                mode: props.mode,
              },
              renderSchemaNodeSlots(props.schema, {})
            ),
            [
              [Drop, { eventsManager: props.designerEventsManager }],
              [DragOver, { eventsManager: props.designerEventsManager }],
            ]
          )
        : h('div', { class: 'varlet-low-code-renderer' }, renderSchemaNodeSlots(props.schema, {}))
  },
})
