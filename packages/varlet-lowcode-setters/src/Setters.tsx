import { defineComponent, ref, onUpdated } from 'vue'
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
import { schemaManager } from '@varlet/lowcode-core'
// import { createParser } from '@varlet/lowcode-parser'
import './index.less'

const active = ref(0)
export default defineComponent({
  name: 'VarletLowCodeSelector',
  setup() {
    const isSelectDom = ref(false)
    const refTab: any = ref(null)
    isSelectDom.value = true
    onUpdated(() => {
      refTab.value?.swipe.resize()
    })
    const schema = schemaManager.exportSchema()
    const schemaId = '81f0286336e44e4e89dd84f48e5c355d'
    const weakMapTree = () => {
      const wm = new WeakMap()
      const params: any = {
        slotProps: [],
        render: [],
      }
      let slotProps = null
      let render = null
      const setTree = (val: any, params?: any) => {
        Object.keys(val).forEach((item) => {
          const paramsItem = JSON.parse(JSON.stringify(params))
          if (item === 'slots') {
            paramsItem.slotProps.push(val.id)
            wm.set(val, paramsItem)
          }
          if (item === 'render') {
            paramsItem.render.push(val[item].renderId)
            wm.set(val, paramsItem)
          }
          if (schemaId === val.id) {
            slotProps = wm.get(val)
            render = wm.get(val)
            console.log(slotProps, render, 'slotPropsslotProps')
          }
          if (typeof val[item] === 'object') {
            setTree(val[item], paramsItem)
          }
        })
      }
      setTree(schema, params)
    }
    weakMapTree()
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
                    <SettersAttribute />
                  </VarTabItems>
                  <VarTabItems>
                    <SettersEvent />
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
