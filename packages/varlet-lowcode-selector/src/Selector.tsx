import type { CSSProperties, Ref } from 'vue'
import { onMounted, onUnmounted, defineComponent, ref, watch } from 'vue'
import PluginRender from './PluginRender'
import props from './props'

export default defineComponent({
  name: 'VarletLowCodeSelector',
  props,
  setup(props) {
    const initStyle: CSSProperties = {
      border: '2px solid red',
      boxSizing: 'border-box',
      position: 'absolute',
      zIndex: 1000,
      pointerEvents: 'none',
    }
    const selectorStyles: Ref<CSSProperties[] | undefined> = ref([])
    const selectorId: Ref<string | undefined> = ref()

    function computedSelectorStyles(id: string) {
      selectorId.value = id.split('dragItem')[1]

      const nodes = document.querySelectorAll(`#${id}`)

      if (nodes && nodes.length > 0) {
        const _nodes = Array.from(nodes)
        selectorStyles.value = _nodes.map((node: Element) => {
          const { top, left, width, height } = node.getBoundingClientRect()
          const _style: CSSProperties = {
            top: `${top}px`,
            left: `${left}px`,
            width: `${width}px`,
            height: `${height}px`,
          }
          return { ..._style, ...initStyle }
        })
      }
    }

    function clickFn(event: Event) {
      const { id } = event.target as HTMLElement

      props.designerEventsManager!.emit('selector', `${id}` || '')

      computedSelectorStyles(id)
    }

    function init() {
      const list = Array.from(document.querySelectorAll('.varlet-low-code--disable-events'))

      list.forEach((itemDom: Element) => {
        itemDom.removeEventListener('click', clickFn)
        itemDom.addEventListener('click', clickFn, { passive: false })
      })
    }

    function dispose() {
      const list = Array.from(document.querySelectorAll('.varlet-low-code--disable-events'))

      list.forEach((itemDom: Element) => {
        itemDom.removeEventListener('click', clickFn)
      })
    }

    watch(
      () => props.schema,
      (newSchemaNode) => {
        if (newSchemaNode) {
          init()
        }
      },
      { deep: true }
    )

    onMounted(init)

    onUnmounted(dispose)

    return () => {
      return (
        selectorId.value &&
        selectorStyles.value &&
        selectorStyles.value.map((style: CSSProperties, i: number) => {
          return (
            <div key={Symbol(style.toString())} style={style}>
              {style && i === selectorStyles.value!.length - 1 && (
                <PluginRender {...props} schemaId={selectorId.value} />
              )}
            </div>
          )
        })
      )
    }
  },
})
