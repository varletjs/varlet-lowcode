import type { PropType } from 'vue'

export declare type DargStatus = 'drag' | 'none'
declare const _default: import('vue').DefineComponent<
  {
    dragStyle: {
      type: PropType<CSSStyleDeclaration>
      default: () => {}
    }
    dragData: {
      type: PropType<any>
      default: undefined
    }
    dragImg: {
      type: PropType<HTMLImageElement | HTMLCanvasElement>
    }
    disabled: {
      type: PropType<boolean>
      default: boolean
    }
    type: {
      type: PropType<'none' | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all' | 'uninitialized'>
      default: string
    }
  },
  () => import('vue').VNode<
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
  ('drag' | 'dragstart' | 'dragend' | 'dragenter' | 'dragover' | 'dragleave' | 'drop')[],
  'drag' | 'dragstart' | 'dragend' | 'dragenter' | 'dragover' | 'dragleave' | 'drop',
  import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps,
  Readonly<
    {
      dragStyle?: unknown
      dragData?: unknown
      dragImg?: unknown
      disabled?: unknown
      type?: unknown
    } & {
      dragStyle: CSSStyleDeclaration
      disabled: boolean
      type: 'none' | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all' | 'uninitialized'
    } & {
      dragData?: any
      dragImg?: HTMLImageElement | HTMLCanvasElement | undefined
    }
  > & {
    onDrag?: ((...args: any[]) => any) | undefined
    onDragstart?: ((...args: any[]) => any) | undefined
    onDragend?: ((...args: any[]) => any) | undefined
    onDragenter?: ((...args: any[]) => any) | undefined
    onDragover?: ((...args: any[]) => any) | undefined
    onDragleave?: ((...args: any[]) => any) | undefined
    onDrop?: ((...args: any[]) => any) | undefined
  },
  {
    dragStyle: CSSStyleDeclaration
    dragData: any
    disabled: boolean
    type: 'none' | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all' | 'uninitialized'
  }
>
export default _default
