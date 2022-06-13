import { VNode } from 'vue'
import type { PropType } from 'vue'

export declare type DropStatus = 'enter' | 'dropped' | 'none'
declare const _default: import('vue').DefineComponent<
  {
    type: {
      type: PropType<'none' | 'copy' | 'link' | 'move'>
      default: string
    }
    dropStyle: {
      type: PropType<CSSStyleDeclaration>
      default: () => {}
    }
    defaultSlotRender: {
      type: PropType<
        VNode<
          import('vue').RendererNode,
          import('vue').RendererElement,
          {
            [key: string]: any
          }
        >
      >
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
  ('dragenter' | 'dragover' | 'dragleave' | 'drop')[],
  'dragenter' | 'dragover' | 'dragleave' | 'drop',
  import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps,
  Readonly<
    {
      type?: unknown
      dropStyle?: unknown
      defaultSlotRender?: unknown
    } & {
      type: 'none' | 'copy' | 'link' | 'move'
      dropStyle: CSSStyleDeclaration
    } & {
      defaultSlotRender?:
        | VNode<
            import('vue').RendererNode,
            import('vue').RendererElement,
            {
              [key: string]: any
            }
          >
        | undefined
    }
  > & {
    onDragenter?: ((...args: any[]) => any) | undefined
    onDragover?: ((...args: any[]) => any) | undefined
    onDragleave?: ((...args: any[]) => any) | undefined
    onDrop?: ((...args: any[]) => any) | undefined
  },
  {
    type: 'none' | 'copy' | 'link' | 'move'
    dropStyle: CSSStyleDeclaration
  }
>
export default _default
