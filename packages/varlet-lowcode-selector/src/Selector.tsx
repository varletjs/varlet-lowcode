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
    }

    const selectorStyles: Ref<CSSProperties | undefined> = ref()

    function computedSelectorStyles(event: Event) {
      const element = event.target as HTMLElement
      const { top, left }: DOMRect = element.getBoundingClientRect()
      const { clientWidth, clientHeight } = element

      const _style: CSSProperties = {
        top: `${top}px`,
        left: `${left}px`,
        width: `${clientWidth}px`,
        height: `${clientHeight}px`,
      }

      selectorStyles.value = Object.assign(_style, initStyle)
    }

    onMounted(() => {
      eventsManager.on('schema-click', computedSelectorStyles)
    })

    onUnmounted(() => {
      eventsManager.off('schema-click', computedSelectorStyles)
    })

    return () => {
      return <div style={selectorStyles.value}>{selectorStyles.value && <PluginRender />}</div>
    }
  },
})
