import { defineComponent, ref } from 'vue'
import './index.less'
import HeaderTabs from './settersPlugins/headerTabs'
import Empty from './empty'

const isSelectDom = ref(false)

isSelectDom.value = true
export default defineComponent({
  name: 'VarletLowCodeSelector',
  setup() {
    return () => {
      return (
        <div class="varlet-lowcode-setters">
          <div class="varlet-lowcode-setters-content">
            {/* {isSelectDom.value ? <HeaderPath /> : null} */}
            {isSelectDom.value ? <HeaderTabs /> : null}
            {isSelectDom.value ? null : <Empty />}
          </div>
        </div>
      )
    }
  },
})
