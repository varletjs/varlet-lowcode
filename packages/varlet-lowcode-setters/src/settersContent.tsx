import { eventsManager } from '@varlet/lowcode-core'
import { CSSProperties, Ref, watch, onMounted, onUnmounted, defineComponent, ref, toRefs } from 'vue'

interface Data {
  [key: string]: unknown
}
export default defineComponent({
  name: 'SettersContent',
  props: {
    tabIndex: Number,
  },
  setup(props: Data) {
    const tabIndex = ref(0)

    watch(props, (newValue, oldValue) => {
      tabIndex.value = newValue.tabIndex as number
    })

    const RenderContent: () => JSX.Element = () => {
      let dom = <div>暂无数据</div>
      if (tabIndex.value === 0) {
        dom = <div>属性内容</div>
      }

      if (tabIndex.value === 1) {
        return <div>样式内容</div>
      }

      if (tabIndex.value === 2) {
        return <div>高级内容</div>
      }
      return dom
    }
    return () => {
      return <RenderContent />
    }
  },
})
