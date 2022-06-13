declare const _default: {
  Drag: import('vue').DefineComponent<
    {
      dragStyle: {
        type: import('vue').PropType<CSSStyleDeclaration>
        default: () => {}
      }
      dragData: {
        type: import('vue').PropType<any>
        default: undefined
      }
      dragImg: {
        type: import('vue').PropType<HTMLImageElement | HTMLCanvasElement>
      }
      disabled: {
        type: import('vue').PropType<boolean>
        default: boolean
      }
      type: {
        type: import('vue').PropType<
          'none' | 'copy' | 'copyLink' | 'copyMove' | 'link' | 'linkMove' | 'move' | 'all' | 'uninitialized'
        >
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
  Drop: import('vue').DefineComponent<
    {
      type: {
        type: import('vue').PropType<'none' | 'copy' | 'link' | 'move'>
        default: string
      }
      dropStyle: {
        type: import('vue').PropType<CSSStyleDeclaration>
        default: () => {}
      }
      defaultSlotRender: {
        type: import('vue').PropType<
          import('vue').VNode<
            import('vue').RendererNode,
            import('vue').RendererElement,
            {
              [key: string]: any
            }
          >
        >
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
          | import('vue').VNode<
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
}
export default _default
