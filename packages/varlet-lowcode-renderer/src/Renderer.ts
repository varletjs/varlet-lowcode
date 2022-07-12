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
} from 'vue'
import {
  assetsManager,
  BuiltInSchemaNodeNames,
  eventsManager,
  schemaManager,
  SchemaPageNodeDataSource,
} from '@varlet/lowcode-core'
import { isArray, isPlainObject, isString } from '@varlet/shared'
import { exec } from './exec'
import { Drag, DragOver, Drop } from '@varlet/lowcode-dnd'
import type { PropType, VNode, DirectiveArguments } from 'vue'
import type {
  SchemaPageNode,
  SchemaNode,
  SchemaTextNode,
  EventsManager,
  SchemaNodeSlot,
  Assets,
} from '@varlet/lowcode-core'
import { createAxle } from '@varlet/axle'

declare const window: Window & {
  setup(): any
  $slotProps?: Record<string, any>
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
      return ['$item', '$index', '$slotProps'].some((scopedVariable) => expression.includes(scopedVariable))
    }

    function resolveScopedExpression(expression: string, schemaNode: SchemaNode) {
      window.$item = schemaNode._item
      window.$index = schemaNode._index
      window.$slotProps = schemaNode._slotProps

      const resolved = exec(`(${expression})`)

      delete window.$item
      delete window.$index
      delete window.$slotProps

      return resolved
    }

    function getExpressionBindingValue(expression: string, schemaNode: SchemaNode) {
      if (!hasScopedVariables(expression)) {
        return exec(`(${expression})`)
      }

      return resolveScopedExpression(expression, schemaNode)
    }

    function getBindingValue(value: any, schemaNode: SchemaNode) {
      if (schemaManager.isExpressionBinding(value)) {
        return getExpressionBindingValue(value.compatibleValue ?? value.value, schemaNode)
      }

      if (schemaManager.isObjectBinding(value)) {
        return value.value
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
      rawProps.onClick = (...arg: any) => {
        eventsManager.emit('schema-click', `dragItem${schemaNode.id}` || '')

        clickEvent && clickEvent(...arg)
      }

      return rawProps
    }

    function withDesigner(schemaNode: SchemaNode) {
      const keyBinding = getBindingValue(schemaNode.key, schemaNode)
      const propsBinding = getPropsBinding(schemaNode)

      const classes = isArray(propsBinding.class)
        ? propsBinding.class
        : isString(propsBinding.class)
        ? propsBinding.class.split(' ')
        : []

      const directives: DirectiveArguments = props.mode === 'designer' ? [[Drag, { dragData: schemaNode }], [Drop]] : []

      props.mode === 'designer' && classes.push('varlet-low-code--disable-events')

      if (schemaManager.isSchemaPageNode(schemaNode)) {
        directives.shift()
        directives.push([DragOver, []])
      }

      return withDirectives(
        h(
          getComponent(schemaNode.name, schemaNode.library!),
          { ...propsBinding, class: classes, key: keyBinding },
          renderSchemaNodeSlots(schemaNode)
        ),
        directives
      )
    }

    function withCondition(schemaNodes: SchemaNode[]): SchemaNode[] {
      return schemaNodes.filter((schemaNode) => Boolean(getBindingValue(schemaNode.if ?? true, schemaNode)))
    }

    function withScopedVariables(schemaNodes: SchemaNode[], parentSchemaNode: SchemaNode, parentSlot: SchemaNodeSlot) {
      const slotProps = { ...parentSchemaNode._slotProps, ...parentSlot._slotProps }
      parentSlot._slotProps = slotProps

      schemaNodes.forEach((schemaNode) => {
        if (parentSchemaNode._item) {
          schemaNode._item = parentSchemaNode._item
        }

        if (parentSchemaNode._index) {
          schemaNode._index = parentSchemaNode._index
        }

        schemaNode._slotProps = slotProps
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

        return isPlainObject(textContent) ? JSON.stringify(textContent) : (textContent ?? '').toString()
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

            const slotChildren = slot.children ?? []
            const conditionedSchemaNodes = withCondition(slotChildren as SchemaNode[])
            const scopedSchemaNodes = withScopedVariables(conditionedSchemaNodes, schemaNode, slot)
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

    return () =>
      withDirectives(
        h('div', { class: 'varlet-low-code-renderer' }, renderSchemaNodeSlots(props.schema)),
        props.mode === 'designer' ? [[Drop], [DragOver]] : []
      )
  },
})
