import { defineComponent, ref } from 'vue'
import { Collapse as VarCollapse, CollapseItem as VarCollapseItem, Icon } from '@varlet/ui'
import Component from '../../built-in-setters/index'
// import Popover from '../../component/popover/popover'
import { AssetProfileMaterialProp } from '@varlet/lowcode-core'
// import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import '@varlet/ui/es/collapse/style/index.js'
import '@varlet/ui/es/collapse-item/style/index.js'
import './index.less'

export default defineComponent({
  name: 'SettersStyle',
  props: {
    schemaId: {
      type: String,
    },
    materialsData: {
      type: Object,
    },
  },
  setup(props) {
    const pureColor = ref('#71afe5')
    const values = ref(['1'])
    const isReady = ref(false)
    // const childrenSlot = reactive({
    //   default: () => {
    //     return (
    //       <div
    //         class={'current-color'}
    //         onClick={() => {
    //           isReady.value = !isReady.value
    //         }}
    //       />
    //     )
    //   },
    //   content: () => (
    //     <div onClick={(e) => e.stopPropagation()}>
    //       <ColorPicker v-model:pureColor={pureColor.value} isWidget />
    //     </div>
    //   ),
    // })

    const layoutContent = (item: any) => {
      let content
      if (item.custom) {
        content = (
          <div class="varlet-low-code-field-body__custom">
            <VarCollapse v-model={values.value}>
              <VarCollapseItem title={item.label} name={item.name}>
                {item.setters.map((itemSetter: any, index: number) => {
                  const setterTypeComponents = Component.filter(
                    (itemComponent) => itemComponent.name === itemSetter.setter
                  )
                  const SetterComponent = setterTypeComponents[setterTypeComponents.length - 1]!.component
                  return (
                    <SetterComponent
                      setter={item}
                      options={itemSetter.props?.options ?? undefined}
                      style={{ marginLeft: index > 0 ? '10px' : 0 }}
                    />
                  )
                })}
              </VarCollapseItem>
            </VarCollapse>
          </div>
        )
        return content
      }
      content = (
        <div class="varlet-low-code-field-body">
          <div class="varlet-low-code-field-body-title">{item.label}</div>
          <div class="varlet-low-code-field-body-content varlet-low-code-field-body__content-style">
            {item.setters.map((itemSetter: any, index: number) => {
              const setterTypeComponents = Component.filter((itemComponent) => itemComponent.name === itemSetter.setter)
              const SetterComponent = setterTypeComponents[setterTypeComponents.length - 1]!.component
              return (
                <SetterComponent
                  setter={item}
                  options={itemSetter.props?.options ?? undefined}
                  style={{ marginLeft: index > 0 ? '10px' : 0 }}
                />
              )
            })}
          </div>
        </div>
      )
      return content
    }

    const RenderContent = () => {
      return (
        <div class="setters-style-field">
          <VarCollapse v-model={values.value}>
            <VarCollapseItem title="样式布局" name="1">
              {props?.materialsData?.style.map((item: AssetProfileMaterialProp) => {
                if (item.visible && !item.visible(props.materialsData?.materialsProps.style ?? {})) {
                  return null
                }
                return layoutContent(item)
              })}
            </VarCollapseItem>
            {/* <Popover v-slots={childrenSlot}></Popover> */}
          </VarCollapse>
        </div>
      )
    }
    return () => {
      return RenderContent()
    }
  },
})
