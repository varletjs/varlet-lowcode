import { defineComponent, ref, onUpdated, reactive } from 'vue'
import HeaderTabs from './settersPlugins/headerTabs'
import Empty from './empty'
import './index.less'

export default defineComponent({
  name: 'VarletLowCodeSelector',
  setup() {
    const isSelectDom = ref(false)
    isSelectDom.value = true
    type stateType = {
      childRef: any
    }

    const state: stateType = reactive({
      childRef: null,
    })
    onUpdated(() => {
      state.childRef?.swipe.resize()
    })

    return () => {
      return (
        <div class="varlet-lowcode-setters">
          <div class="varlet-lowcode-setters-content">
            {isSelectDom.value ? (
              <HeaderTabs
                refCallback={(ref: any) => {
                  state.childRef = ref
                }}
              />
            ) : null}
            {isSelectDom.value ? null : <Empty />}
          </div>
        </div>
      )
    }
  },
})
