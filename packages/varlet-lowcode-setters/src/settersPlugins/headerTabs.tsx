import { defineComponent, ref } from 'vue'
import { Tabs as VarTabs, Tab as VarTab, TabsItems as VarTabsItems, TabItem as VarTabItems } from '@varlet/ui'
import '@varlet/ui/es/tabs/style/index.js'
import '@varlet/ui/es/tab/style/index.js'
import '@varlet/ui/es/tab-item/style/index.js'
import '@varlet/ui/es/tabs-items/style/index.js'
import SettersAttribute from '../settersAttribute'
import SettersStyle from '../settersStyle'

const active = ref(0)

export default defineComponent({
  name: 'VarletLowCodeSelector',
  setup() {
    return () => {
      return (
        <div class="setters-tabs-content">
          <VarTabs elevation v-model:active={active.value}>
            <VarTab>属性</VarTab>
            <VarTab>样式</VarTab>
            <VarTab>事件</VarTab>
            <VarTab>高级</VarTab>
          </VarTabs>
          <VarTabsItems v-model:active={active.value}>
            <VarTabItems>
              {/* <SettersStyle /> */}
              <SettersAttribute />
            </VarTabItems>
            <VarTabItems>
              <SettersStyle />
            </VarTabItems>
            <VarTabItems>
              <div>事件绑定</div>
              {/* <SettersContent tab-index={active.value} /> */}
            </VarTabItems>
          </VarTabsItems>
        </div>
      )
    }
  },
})
