import {
  defineComponent,
  h,
  ref,
  reactive,
  computed,
  watch,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'vue'
import { BuiltInSchemaNodeNames, BuiltInSchemaNodeBindingTypes } from '@varlet/lowcode-core'
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

type RawProps = Record<string, any>

Object.assign(window, {
  ref,
  reactive,
  computed,
  watch,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
})

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
    const setup = eval(`(${props.schema.code ?? 'function setup() { return {} }'})`)
    const ctx = setup()

    function hoistWindow() {
      Object.assign(window, ctx)
      window.$slotsParams = {}
    }

    function getValueOrBindingValue(value: any) {
      if (isPlainObject(value)) {
        const { value: bindingValue, type: bindingType } = value

        return bindingType === BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING ? eval(bindingValue) : value
      }

      return value
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

    // TODO: handle designer mode logic
    watch(
      [() => props.schema.variables, () => props.schema.functions, () => props.schema.code],
      () => {
        window.location.reload()
      },
      {
        deep: true,
      }
    )

    hoistWindow()

    return () => h('div', { class: 'varlet-low-code-renderer' }, renderSchemaNodeSlots(props.schema))
  },
})
