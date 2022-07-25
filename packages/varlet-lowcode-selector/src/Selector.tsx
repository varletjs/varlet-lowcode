import { EventsManager } from '@varlet/lowcode-core'
import type { CSSProperties, Ref } from 'vue'
import { onMounted, onUnmounted, defineComponent, ref, PropType } from 'vue'
import PluginRender from './PluginRender'

export default defineComponent({
  name: 'VarletLowCodeSelector',
  props: {
    designerEventsManager: {
      type: Object as PropType<EventsManager>,
    },
  },
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

    onMounted(() => {
      props.designerEventsManager!.on('selector', computedSelectorStyles)
    })

    onUnmounted(() => {
      props.designerEventsManager!.off('selector', computedSelectorStyles)
    })

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
