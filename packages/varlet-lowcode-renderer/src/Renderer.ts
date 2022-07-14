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
import type { PropType, VNode, DirectiveArguments } from 'vue'
import type { SchemaPageNode, SchemaNode, SchemaTextNode, EventsManager, Assets } from '@varlet/lowcode-core'
import { createAxle } from '@varlet/axle'

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

    function resolveScopedExpression(expression: string, schemaNode: SchemaNode) {
      window.$item = schemaNode._item
      window.$index = schemaNode._index
      window.$slotProps = schemaNode._slotProps
      window.$renderArgs = schemaNode._renderArgs

      const resolved = exec(expression)

      delete window.$item
      delete window.$index
      delete window.$slotProps
      delete window.$renderArgs

      return resolved
    }

    function getExpressionBindingValue(expression: string, schemaNode: SchemaNode) {
      if (!hasScopedVariables(expression)) {
        return exec(`(${expression})`)
      }

      return resolveScopedExpression(expression, schemaNode)
    }

    function getObjectBindingValue(value: any, schemaNode: SchemaNode) {
      return Object.keys(value).reduce((newValue, key) => {
        newValue[key] = getBindingValue(value[key], schemaNode)

        return newValue
      }, {} as Record<string, any>)
    }

    function getBindingValue(value: any, schemaNode: SchemaNode): any {
      if (schemaManager.isRenderBinding(value)) {
        return (...args: any[]) =>
          h(
            Fragment,
            value.value.map((schemaNodeChild: SchemaNode) => {
              schemaNodeChild._renderArgs = {
                ...(schemaNode._renderArgs ?? {}),
                [value.renderId!]: args,
              }

              return renderSchemaNode(schemaNodeChild)
            })
          )
      }

      if (schemaManager.isExpressionBinding(value)) {
        return getExpressionBindingValue(value.compatibleValue ?? value.value, schemaNode)
      }

      if (schemaManager.isObjectBinding(value)) {
        return getObjectBindingValue(value, schemaNode)
      }

      if (isArray(value)) {
        return value.map((item) => getBindingValue(item, schemaNode))
      }

      return value
    }

    function getComponent(schemaNodeName: string, schemaNodeLibrary: string) {
      return assetsManager.findComponent(props.assets, schemaNodeName, schemaNodeLibrary)
    }

    function getPropsBinding(schemaNode: SchemaNode) {
      const rawProps = Object.entries(schemaNode.props ?? {}).reduce((rawProps, [key, value]) => {
        rawProps[key] = getBindingValue(value, schemaNode)

        return rawProps
      }, {} as RawProps)

      const clickEvent = rawProps.onClick

      rawProps.id = `dragItem${schemaNode.id}`
      props.mode === 'designer' &&
        (rawProps.onClick = (...arg: any) => {
          props.designerEventsManager!.emit('selector', `dragItem${schemaNode.id}` || '')

          clickEvent && clickEvent(...arg)
        })

      return rawProps
    }

    function withDesigner(schemaNode: SchemaNode) {
      const propsBinding = getPropsBinding(schemaNode)

      const classes = isArray(propsBinding.class)
        ? propsBinding.class
        : isString(propsBinding.class)
        ? propsBinding.class.split(' ')
        : []

      if (props.mode !== 'designer') {
        return h(
          getComponent(schemaNode.name, schemaNode.library!),
          { ...propsBinding, class: classes, key: keyBinding },
          renderSchemaNodeSlots(schemaNode)
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
          renderSchemaNodeSlots(schemaNode)
        ),
        directives
      )
    }

    function withCondition(schemaNodes: SchemaNode[]): SchemaNode[] {
      return schemaNodes.filter((schemaNode) => Boolean(getBindingValue(schemaNode.if ?? true, schemaNode)))
    }

    function withScopedVariables(
      schemaNodes: SchemaNode[],
      parentSchemaNode: SchemaNode,
      mergedSlotProps: Record<string, any>
    ) {
      schemaNodes.forEach((schemaNode) => {
        if (parentSchemaNode._item) {
          schemaNode._item = parentSchemaNode._item
        }

        if (parentSchemaNode._index) {
          schemaNode._index = parentSchemaNode._index
        }

        if (parentSchemaNode._renderArgs) {
          schemaNode._renderArgs = parentSchemaNode._renderArgs
        }

        schemaNode._slotProps = mergedSlotProps
      })

      return schemaNodes
    }

    function withLoop(schemaNodes: SchemaNode[]): SchemaNode[] {
      const flatSchemaNodes: SchemaNode[] = []

      schemaNodes.forEach((schemaNode) => {
        if (!schemaNode.hasOwnProperty('for')) {
          flatSchemaNodes.push(schemaNode)
          return
        }

        let items: any = getBindingValue(schemaNode.for, schemaNode)

        if (!isArray(items)) {
          items = Array.from({ length: Number(items) || 0 })
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

    function renderSchemaNode(schemaNode: SchemaNode): VNode | string {
      if (schemaNode.name === BuiltInSchemaNodeNames.TEXT) {
        const textContent = getBindingValue((schemaNode as SchemaTextNode).textContent, schemaNode)

        return isObject(textContent) ? JSON.stringify(textContent) : (textContent ?? '').toString()
      }

      return withDesigner(schemaNode)
    }

    function renderSchemaNodeSlots(schemaNode: SchemaNode): RawSlots {
      if (isPlainObject(schemaNode.slots)) {
        return Object.entries(schemaNode.slots).reduce((rawSlots, [slotName, slot]) => {
          rawSlots[slotName] = (slotProps: any) => {
            if (!slot._slotProps) {
              slot._slotProps = {}
            }

            slot._slotProps[schemaNode.id!] = slotProps
            const mergedSlotProps = { ...schemaNode._slotProps, ...slot._slotProps }
            slot._slotProps = mergedSlotProps

            const slotChildren = slot.children ?? []

            const conditionedSchemaNodes = withCondition(slotChildren as SchemaNode[])
            const scopedSchemaNodes = withScopedVariables(conditionedSchemaNodes, schemaNode, mergedSlotProps)
            const loopedSchemaNodes = withLoop(scopedSchemaNodes)

            return loopedSchemaNodes.map((schemaNodeChild) => renderSchemaNode(schemaNodeChild))
          }

          return rawSlots
        }, {} as RawSlots)
      }

      return {}
    }

    hoistWindow(ctx)
    setDndDisabledStyle()

    onMounted(mountCss)

    onUnmounted(() => {
      uninstallDndDisabledStyle()
      restoreWindow()
      unmountCss()
    })

    // @ts-ignore
    window.abc = props.schema

    return () =>
      props.mode === 'designer'
        ? withDirectives(h('div', { class: 'varlet-low-code-renderer' }, renderSchemaNodeSlots(props.schema)), [
            [Drop, { eventsManager: props.designerEventsManager }],
            [DragOver, { eventsManager: props.designerEventsManager }],
          ])
        : h('div', { class: 'varlet-low-code-renderer' }, renderSchemaNodeSlots(props.schema))
  },
})
