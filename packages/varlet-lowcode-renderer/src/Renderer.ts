import { defineComponent, h, VNode } from 'vue'
import { BuiltInSchemaNodeNames } from '@varlet/lowcode-core'
import { isPlainObject } from './shared'
import type { DefineComponent, PropType } from 'vue'
import type { SchemaPageNode, SchemaNode, SchemaTextNode } from '@varlet/lowcode-core'

declare const window: Window & { Varlet: Record<string, DefineComponent> }

type RawSlots = {
  [name: string]: unknown
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
    },
  },

  setup(props) {
    function withDesigner(schemaNode: SchemaNode) {
      if (props.mode === 'designer') {
        // TODO: wrap designer component
        return h(window.Varlet[schemaNode.name], schemaNode.props, renderSchemaNodeSlots(schemaNode))
      }

      return h(window.Varlet[schemaNode.name], schemaNode.props, renderSchemaNodeSlots(schemaNode))
    }

    function renderSchemaNode(schemaNode: SchemaNode): VNode | string {
      if (schemaNode.name === BuiltInSchemaNodeNames.TEXT) {
        return (schemaNode as SchemaTextNode).textContent
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

    return () => h('div', { class: 'varlet-low-code-renderer' }, renderSchemaNodeSlots(props.schema))
  },
})
