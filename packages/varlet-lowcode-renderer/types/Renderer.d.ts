import { Assets } from '@varlet/lowcode-core'
import type { PropType, VNode } from 'vue'
import type { SchemaPageNode } from '@varlet/lowcode-core'

declare const _default: import('vue').DefineComponent<
  {
    mode: {
      type: PropType<'designer' | 'render'>
      default: string
    }
    schema: {
      type: PropType<SchemaPageNode>
      required: true
      default: () => {}
    }
    assets: {
      type: PropType<Assets>
      required: true
      default: () => never[]
    }
  },
  () => VNode<
    import('vue').RendererNode,
    import('vue').RendererElement,
    {
      [key: string]: any
    }
  >,
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  Record<string, any>,
  string,
  import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps,
  Readonly<
    {
      mode?: unknown
      schema?: unknown
      assets?: unknown
    } & {
      mode: 'designer' | 'render'
      schema: SchemaPageNode
      assets: Assets
    } & {}
  >,
  {
    mode: 'designer' | 'render'
    schema: SchemaPageNode
    assets: Assets
  }
>
export default _default
