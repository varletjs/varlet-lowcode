import { defineComponent, ref, onUpdated, Ref, onUnmounted, reactive, nextTick } from 'vue'
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
import styleMaterials from './style'
import {
  schemaManager,
  eventsManager,
  assetsManager,
  Assets,
  AssetsManager,
  BuiltInEvents,
  AssetProfileMaterialProp,
} from '@varlet/lowcode-core'
import './index.less'

const active = ref(0)
export default defineComponent({
  name: 'VarletLowCodeSetter',
  setup() {
    const schemaId: Ref<string> = ref('')
    const isSelectDom = ref(false)
    const refTab: any = ref(null)
    const schema = schemaManager.exportSchema()

    let assets = assetsManager.exportAssets()
    const schemaNode: Ref<any> = ref({})
    const materialsData: any = reactive({
      attrs: [],
      materialsProps: [],
      event: [],
      style: [],
    })
    const SelectorChange = ref(true)

    const deepClone = (source: any) => {
      const targetObj: any = Array.isArray(source) ? [] : {}

      for (const keys in source) {
        if (source.hasOwnProperty(keys)) {
          if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = Array.isArray(source[keys]) ? [] : {}
            targetObj[keys] = deepClone(source[keys])
          } else {
            targetObj[keys] = source[keys]
          }
        }
      }

      return targetObj
    }

    const computedSelectorStyles = (id: string) => {
      isSelectDom.value = true
      SelectorChange.value = false
      schemaId.value = id.split('dragItem')[1]
      schemaNode.value = schemaManager.findSchemaNodeById(schema, schemaId.value)

      if (schemaNode.value && schemaNode.value.library && schemaNode.value.name) {
        const materials: any = deepClone(getRendererAssetsManager(assets))
        materials.props ? setSetterData(materials.props) : null
      }
    }

    const setSetterData = (props: AssetProfileMaterialProp[]) => {
      const event: AssetProfileMaterialProp[] = []
      const style: AssetProfileMaterialProp[] = deepClone(styleMaterials)
      const attrs: AssetProfileMaterialProp[] = []
      const materialsProps: any = {}

      props?.forEach((item) => {
        if (item.name.indexOf('on') === 0 && item.name[2] === item.name[2].toUpperCase()) {
          event.push(item)
        } else {
          const schemaName = schemaNode.value.props
            ? Object.keys(schemaNode.value.props).filter((itemSchema) => itemSchema === item.name)[0]
            : null

          if (schemaName) {
            item.defaultValue = schemaNode.value.props[schemaName]
          }

          attrs.push(item)
          materialsProps[item.name] = item.defaultValue
        }
      })
      style.forEach((item) => {
        const changeType = item?.name.split(':')
        const schemaName =
          schemaNode.value.props && schemaNode.value.props.style
            ? Object.keys(schemaNode.value.props.style).filter((itemSchema) => `style:${itemSchema}` === item.name)[0]
            : null

        if (schemaName) {
          item.defaultValue = schemaNode.value.props.style[schemaName]
        }

        materialsProps[changeType[0]] = {
          ...materialsProps[changeType[0]],
          ...{ [changeType[1]]: item.defaultValue },
        }
      })

      materialsData.event = event
      materialsData.attrs = attrs
      materialsData.style = style
      materialsData.materialsProps = materialsProps

      console.log(materialsData, 'materialsData')

      nextTick(() => {
        SelectorChange.value = true
      })
    }

    const getRendererAssetsManager = (assets: Assets) => {
      const rendererWindow = Array.from(window).find((w) => w.name === 'rendererWindow') as any
      const rendererAssetsManager = rendererWindow?.VarletLowcodeCore?.assetsManager as AssetsManager | undefined
      if (!rendererAssetsManager) {
        return []
      }
      return rendererAssetsManager.findMaterial(assets, schemaNode.value.name, schemaNode.value.library)
    }

    const handleSkeletonLoaded = () => {
      assets = assetsManager.exportAssets()
    }

    const handleAssetsChange = (newAssets: Assets) => {
      assets = newAssets
    }

    const setterValueChange = (prop: any) => {
      const changeType = prop?.name.split(':')
      schemaNode.value.props ? schemaNode.value.props : (schemaNode.value.props = {})
      if (!changeType[1]) {
        schemaNode.value.props = {
          ...schemaNode.value.props,
          ...{ [prop.name]: prop.defaultValue },
        }

        materialsData.materialsProps[prop.name] = prop.defaultValue
      } else {
        schemaNode.value.props = {
          ...schemaNode.value.props,
          ...{
            [changeType[0]]: {
              ...schemaNode.value.props[changeType[0]],
              ...{ [changeType[1]]: prop.defaultValue },
            },
          },
        }

        materialsData.materialsProps[changeType[0]] = {
          ...materialsData.materialsProps[changeType[0]],
          ...{ [changeType[1]]: prop.defaultValue },
        }

        console.log(materialsData.materialsProps, 'materialsData.materialsProps')
      }
      eventsManager.emit(BuiltInEvents.SCHEMA_CHANGE, schema)
      eventsManager.emit('DOMRectChange', schemaId.value)
    }

    eventsManager.on(BuiltInEvents.ASSETS_CHANGE, handleAssetsChange)
    eventsManager.on('selector', computedSelectorStyles)
    eventsManager.on('skeleton-loaded', handleSkeletonLoaded)
    eventsManager.on('setter-value-change', setterValueChange)

    onUnmounted(() => {
      eventsManager.off(BuiltInEvents.ASSETS_CHANGE, handleAssetsChange)
      eventsManager.off('skeleton-loaded', handleSkeletonLoaded)
      eventsManager.off('selector', computedSelectorStyles)
      eventsManager.off('setter-value-change', setterValueChange)
    })

    onUpdated(() => {
      refTab.value?.swipe.resize()
    })

    return () => {
      return (
        <div class="varlet-lowcode-setters">
          <div class="varlet-lowcode-setters-content">
            {isSelectDom.value ? (
              <div class="varlet-low-code-setters__tabs-content">
                <VarTabs elevation v-model:active={active.value}>
                  <VarTab>属性</VarTab>
                  <VarTab>事件</VarTab>
                  <VarTab>样式</VarTab>
                  <VarTab>高级</VarTab>
                </VarTabs>
                <VarTabsItems v-model:active={active.value} ref={refTab}>
                  <VarTabItems>
                    {SelectorChange.value ? (
                      <SettersAttribute schemaId={schemaId.value} materialsData={materialsData} />
                    ) : (
                      <SettersAttribute />
                    )}
                  </VarTabItems>
                  <VarTabItems>
                    <SettersEvent schemaId={schemaId.value} />
                  </VarTabItems>
                  <VarTabItems>
                    {SelectorChange.value ? (
                      <SettersStyle schemaId={schemaId.value} materialsData={materialsData} />
                    ) : (
                      <SettersStyle />
                    )}
                  </VarTabItems>
                  <VarTabItems>
                    <SettersAdvancedSettings schemaId={schemaId.value} />
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
