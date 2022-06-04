import { defineComponent, h, ref, watch } from 'vue'
import { BuiltInSchemaNodeNames, BuiltInSchemaNodeBindingTypes } from '@varlet/lowcode-core'
import { isPlainObject } from './shared'
import type { DefineComponent, PropType, VNode } from 'vue'
import type { SchemaPageNode, SchemaNode, SchemaTextNode, SchemaNodeProps } from '@varlet/lowcode-core'

declare const window: Window & { Varlet: Record<string, DefineComponent> }

type RawSlots = {
  [name: string]: unknown
}

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

type RawProps = Record<string, any>

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
    let ctx: Record<string, any> = {}

    function exposeFunctions() {
      const { functions = {} } = props.schema

      Object.assign(
        ctx,
        Object.entries(functions).reduce((functions, [key, { async, params, body }]) => {
          functions[key] = async
            ? new AsyncFunction(...params, body).bind(ctx)
            : new Function(...params, body).bind(ctx)

          return functions
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

    function getValueOrBindingValue(value: any) {
      if (isPlainObject(value)) {
        const { value: bindingValue, type: bindingType } = value
        if (bindingType === BuiltInSchemaNodeBindingTypes.FUNCTION_BINDING) {
          return ctx[bindingValue]
        }

        if (bindingType === BuiltInSchemaNodeBindingTypes.VARIABLE_BINDING) {
          return ctx[bindingValue].value
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
        return getValueOrBindingValue((schemaNode as SchemaTextNode).textContent)
      }

      return withDesigner(schemaNode)
    }

    function renderSchemaNodeSlots(schemaNode: SchemaNode): RawSlots {
      if (isPlainObject(schemaNode.slots)) {
        return Object.entries(schemaNode.slots).reduce((slots, [key, schemaNodes]) => {
          slots[key] = () => schemaNodes.map(renderSchemaNode)

          return slots
        }, {} as RawSlots)
      }

      return {}
    }

    watch(
      () => props.schema,
      () => {
        ctx = {}
        exposeVariables()
        exposeFunctions()
      },
      { immediate: true }
    )

    return () => h('div', { class: 'varlet-low-code-renderer' }, renderSchemaNodeSlots(props.schema))
  },
})
