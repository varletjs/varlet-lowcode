import { eventsManager } from '@varlet/lowcode-core'
import type { CSSProperties, Ref } from 'vue'
import { onMounted, defineComponent, ref } from 'vue'
// import { pluginsManager } from '@varlet/lowcode-core'
// import { SelectorPlugin } from '@varlet/lowcode-core/src/modules/plugins'

export default defineComponent({
  name: 'VarletLowCodeSelector',
  setup() {
    const initStyle: CSSProperties = {
      border: '2px solid red',
      boxSizing: 'border-box',
      position: 'absolute',
    }

    // const plugins: SelectorPlugin[] = pluginsManager.exportSelectorPlugins()
    const selectorStyles: Ref<CSSProperties | undefined> = ref()

    function computeRippleStyles(event: Event) {
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
      eventsManager.on('schema-click', computeRippleStyles)
    })

    return () => {
      return <div style={selectorStyles.value}></div>
    }
  },
})
