import {
  defineComponent,
  h,
  ref,
  watch,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'vue'
import { BuiltInSchemaNodeNames, BuiltInSchemaNodeBindingTypes, SchemaPageNodeLifeCycles } from '@varlet/lowcode-core'
import { isPlainObject } from './shared'
import type { DefineComponent, PropType, VNode } from 'vue'
import type { SchemaPageNode, SchemaNode, SchemaTextNode, SchemaNodeProps } from '@varlet/lowcode-core'

declare const window: Window & {
  Varlet: Record<string, DefineComponent>
  $slotsParams: Record<string, any>
}

type RawSlots = {
  [name: string]: unknown
}

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

type RawProps = Record<string, any>

type ContextLifeCycles<T> = {
  [P in keyof T]?: () => void
}

type Context = { _lifeCycles: ContextLifeCycles<SchemaPageNodeLifeCycles> } & Record<string, any>

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
  },

  setup(props) {
    let ctx: Context = { _lifeCycles: {} }
    let windowOriginCtx: Record<string, any> = {}

    function exposeFunctions() {
      const { functions } = props.schema

      Object.assign(
        ctx,
        Object.entries(functions ?? {}).reduce((functions, [key, { async, params, body }]) => {
          const Constructor = async ? AsyncFunction : Function
          functions[key] = new Constructor(...params, body).bind(ctx)

          return functions
        }, {} as any)
      )
    }

    function exposeLifeCycles() {
      const { lifeCycles } = props.schema

      Object.assign(
        ctx._lifeCycles,
        Object.entries(lifeCycles ?? {}).reduce((lifeCycles, [key, { async, params, body }]) => {
          const Constructor = async ? AsyncFunction : Function
          lifeCycles[key] = new Constructor(...params, body).bind(ctx)

          return lifeCycles
        }, {} as any)
      )
    }

    function exposeVariables() {
      const { variables = {} } = props.schema

      Object.assign(
        ctx,
        Object.entries(variables).reduce((variables, [key, value]) => {
          variables[key] = ref(value)

          return variables
        }, {} as any)
      )
    }

    function exposeWindow() {
      windowOriginCtx = Object.keys(ctx).reduce((windowOriginCtx, key: string) => {
        windowOriginCtx[key] = (window as Record<string, any>)[key]

        return windowOriginCtx
      }, {} as Record<string, any>)

      Object.assign(window, ctx)
    }

    function exposeApis() {
      Object.assign(window, windowOriginCtx)
      ctx = { _lifeCycles: {} }
      windowOriginCtx = {}
      window.$slotsParams = {}
      exposeVariables()
      exposeFunctions()
      exposeLifeCycles()
      exposeWindow()
    }

    function getValueOrBindingValue(value: any) {
      if (isPlainObject(value)) {
        const { value: bindingValue, type: bindingType } = value

        if (bindingType === BuiltInSchemaNodeBindingTypes.FUNCTION_BINDING) {
          return ctx[bindingValue]
        }

        if (bindingType === BuiltInSchemaNodeBindingTypes.VARIABLE_BINDING) {
          return ctx[bindingValue].value
        }

        if (bindingType === BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING) {
          return eval(bindingValue)
        }
      } else {
        return value
      }
    }

    function withPropsBinding(props: SchemaNodeProps) {
      const rawProps = Object.entries(props).reduce((rawProps, [key, value]) => {
        rawProps[key] = getValueOrBindingValue(value)

        return rawProps
      }, {} as RawProps)

      return rawProps
    }

    function withDesigner(schemaNode: SchemaNode) {
      if (props.mode === 'designer') {
        // TODO: wrap designer component
        return h(
          window.Varlet[schemaNode.name],
          withPropsBinding(schemaNode.props ?? {}),
          renderSchemaNodeSlots(schemaNode)
        )
      }

      return h(
        window.Varlet[schemaNode.name],
        withPropsBinding(schemaNode.props ?? {}),
        renderSchemaNodeSlots(schemaNode)
      )
    }

    function renderSchemaNode(schemaNode: SchemaNode): VNode | string {
      if (schemaNode.name === BuiltInSchemaNodeNames.TEXT) {
        return String(getValueOrBindingValue((schemaNode as SchemaTextNode).textContent))
      }

      return withDesigner(schemaNode)
    }

    function renderSchemaNodeSlots(schemaNode: SchemaNode): RawSlots {
      if (isPlainObject(schemaNode.slots)) {
        return Object.entries(schemaNode.slots).reduce((slots, [key, schemaNodes]) => {
          slots[key] = (...args: any[]) => {
            window.$slotsParams[schemaNode.id] = {}
            window.$slotsParams[schemaNode.id][key] = [...args]
            return schemaNodes.map(renderSchemaNode)
          }

          return slots
        }, {} as RawSlots)
      }

      return {}
    }

    function registryLifeCycles() {
      onBeforeMount(() => ctx._lifeCycles.onBeforeMount?.())
      onMounted(() => ctx._lifeCycles.onMounted?.())
      onBeforeUpdate(() => ctx._lifeCycles.onBeforeUpdate?.())
      onUpdated(() => ctx._lifeCycles.onUpdated?.())
      onBeforeUnmount(() => ctx._lifeCycles.onBeforeUnmount?.())
      onUnmounted(() => ctx._lifeCycles.onUnmounted?.())
    }

    // TODO: handle designer mode logic
    watch([() => props.schema.variables, () => props.schema.functions, () => props.schema.lifeCycles], exposeApis, {
      deep: true,
    })

    registryLifeCycles()
    exposeApis()

    return () => h('div', { class: 'varlet-low-code-renderer' }, renderSchemaNodeSlots(props.schema))
  },
})
