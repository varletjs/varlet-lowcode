import { watch, defineComponent, ref } from 'vue'
import SettersAttribute from './settersAttribute'
import SettersStyle from './settersStyle'

interface Data {
  [key: string]: unknown
}
export default defineComponent({
  name: 'SettersContent',
  props: {
    tabIndex: Number,
  },
  setup(props: Data) {
    const tabIndex = ref(1)

    watch(props, (newValue) => {
      tabIndex.value = newValue.tabIndex as number
    })

    const RenderContent = () => {
      if (tabIndex.value === 0) {
        return (
          <div>
            <SettersAttribute />
          </div>
        )
      }

      if (tabIndex.value === 1) {
        return (
          <div>
            <SettersStyle />
          </div>
        )
      }

      if (tabIndex.value === 2) {
        return <div>事件内容</div>
      }

      if (tabIndex.value === 3) {
        return <div>高级内容</div>
      }
      return <></>
    }
    return () => {
      return RenderContent()
    }
  },
})
