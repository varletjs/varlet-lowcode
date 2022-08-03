import type { SchemaNode, SchemaPageNode, SchemaTextNode } from '@varlet/lowcode-core'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      page: Exclude<SchemaPageNode, 'slots'>
      slot: {
        name?: string
      }
      node: Exclude<SchemaNode, 'slots'>
      t: Exclude<SchemaTextNode, 'slots'>
    }
  }
}
