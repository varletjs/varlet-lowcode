import type { DefineComponent, PropType } from 'vue'
import { defineComponent, h, VNode } from 'vue'
import type { SchemaPageNode, SchemaNode, SchemaTextNode } from '@varlet/lowcode-core'
import { BuiltInSchemaNodeNames } from '@varlet/lowcode-core'
import { isArray } from './shared'

declare const window: Window & { Varlet: Record<string, DefineComponent> }

function renderSchemaNode(schemaNode: SchemaNode): VNode | string {
  if (schemaNode.name === BuiltInSchemaNodeNames.TEXT) {
    return (schemaNode as SchemaTextNode).textContent
  }

  return h(window.Varlet[schemaNode.name], schemaNode.props, {
    default: () => renderSchemaNodeChildren(schemaNode),
  })
}

function renderSchemaNodeChildren(schemaNode: SchemaNode): (VNode | string)[] {
  if (isArray(schemaNode.children)) {
    return schemaNode.children.map(renderSchemaNode)
  }

  return []
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
    return () => h('div', { class: 'varlet-low-code-renderer' }, renderSchemaNodeChildren(props.schema))
  },
})
