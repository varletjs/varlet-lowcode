import { eventsManager } from '@varlet/lowcode-core'
import type { CSSProperties, Ref } from 'vue'
import { onMounted, onUnmounted, defineComponent, ref } from 'vue'
import PluginRender from './PluginRender'

export default defineComponent({
  name: 'VarletLowCodeSelector',
  setup() {
    const initStyle: CSSProperties = {
      border: '2px solid red',
      boxSizing: 'border-box',
      position: 'absolute',
      zIndex: 1000,
      pointerEvents: 'none',
    }
    const selectorStyles: Ref<CSSProperties[] | undefined> = ref([])

    function computedSelectorStyles(id: string) {
      const iframe = document.querySelector('iframe')

      const nodes = iframe!.contentDocument!.querySelectorAll(`#${id}`)

      if (nodes && nodes.length > 0) {
        const _nodes = Array.from(nodes)
        const { top: iframeTop = 0, left: iframeLeft = 0 } = iframe!.getBoundingClientRect()
        selectorStyles.value = _nodes.map((node: Element) => {
          const { top, left, width, height } = node.getBoundingClientRect()
          const _style: CSSProperties = {
            top: `${top + iframeTop}px`,
            left: `${left + iframeLeft}px`,
            width: `${width}px`,
            height: `${height}px`,
          }
          return { ..._style, ...initStyle }
        })
      }
    }

    onMounted(() => {
      eventsManager.on('selector', computedSelectorStyles)
    })

    onUnmounted(() => {
      eventsManager.off('selector', computedSelectorStyles)
    })

    return () => {
      return (
        selectorStyles.value &&
        selectorStyles.value.map((style: CSSProperties, i: number) => {
          return (
            <div key={Symbol(style.toString())} style={style}>
              {style && i === selectorStyles.value!.length - 1 && <PluginRender />}
            </div>
          )
        })
      )
    }
  },
})
