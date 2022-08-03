import { defineComponent, ref, onUpdated, Ref, onMounted } from 'vue'
import Empty from './empty'
import { Tabs as VarTabs, Tab as VarTab, TabsItems as VarTabsItems, TabItem as VarTabItems } from '@varlet/ui'
import '@varlet/ui/es/tabs/style/index.js'
import '@varlet/ui/es/tab/style/index.js'
import '@varlet/ui/es/tab-item/style/index.js'
import '@varlet/ui/es/tabs-items/style/index.js'
import SettersAttribute from './tabs-content/setters-attribute/index'
import SettersStyle from './tabs-content/setters-style/index'
import SettersAdvancedSettings from './tabs-content/setters-advanced-setting/index'
import SettersEvent from './tabs-content/setters-event/index'
import { schemaManager, eventsManager } from '@varlet/lowcode-core'
import { createParser } from '@varlet/lowcode-parser'
import './index.less'

const active = ref(0)
export default defineComponent({
  name: 'VarletLowCodeSetter',
  setup() {
    const schemaId: Ref<string> = ref('')
    const isSelectDom = ref(false)
    const refTab: any = ref(null)
    const computedSelectorStyles = (id: string) => {
      isSelectDom.value = true
      schemaId.value = id.split('dragItem')[1]
    }
    onMounted(() => {
      eventsManager.on('selector', computedSelectorStyles)
    })
    onUpdated(() => {
      refTab.value?.swipe.resize()
    })

    return () => {
      return (
        <div class="varlet-lowcode-setters">
          <div class="varlet-lowcode-setters-content">
            {isSelectDom.value ? (
              <div class="setters-tabs-content">
                <VarTabs elevation v-model:active={active.value}>
                  <VarTab>属性</VarTab>
                  <VarTab>事件</VarTab>
                  <VarTab>样式</VarTab>
                  <VarTab>高级</VarTab>
                </VarTabs>
                <VarTabsItems v-model:active={active.value} ref={refTab}>
                  <VarTabItems>
                    <SettersAttribute schemaId={schemaId.value} />
                  </VarTabItems>
                  <VarTabItems>
                    <SettersEvent schemaId={schemaId.value} />
                  </VarTabItems>
                  <VarTabItems>
                    <SettersStyle />
                  </VarTabItems>
                  <VarTabItems>
                    <SettersAdvancedSettings />
                  </VarTabItems>
                </VarTabsItems>
              </div>
            ) : (
              <Empty />
            )}
          </div>
        </div>
      )
    }
  },
})
