import { defineComponent, ref, Ref, watchEffect } from 'vue'
import { Collapse as VarCollapse, CollapseItem as VarCollapseItem } from '@varlet/ui'
import { AssetProfileMaterialProp } from '@varlet/lowcode-core'
import Component from '../../built-in-setters/index'
import '@varlet/ui/es/collapse/style/index.js'
import '@varlet/ui/es/collapse-item/style/index.js'
import BindTypePopover from '../../component/bind-type/index'
import BindDialog from '../../component/dialog-setter/index'
import './index.less'

export default defineComponent({
  name: 'SettersAttribute',
  props: {
    schemaId: {
      type: String,
    },
    materialsData: {
      type: Object,
    },
  },
  setup(props) {
    watchEffect(() => {
      // console.log(props.schemaId,123456)
      // console.log(props.materialsData,123456)
    })
    const values = ref(['1'])
    const openBindDialog = (val: string) => {
      showDialog.value = true
      return val
    }
    const showDialog = ref(false)
    const dialogCode: Ref<any> = ref()
    const saveCode = () => {
      showDialog.value = false
    }
    const layoutContent = (item: any) => {
      let content
      if (item.layout === 'singRow') {
        // content = (
        //   <div class="varlet-low-code-field-body">
        //     <div class="varlet-low-code-field-body-content__sing-row">
        //       <div class="varlet-low-code-field-body-title">{item.description}</div>
        //       <Icon name="dots-vertical" class="varlet-low-code-field-body__setter-icon" />
        //     </div>
        //     <div class="varlet-low-code-field-body-content__sing-row">
        //       {item.setters.map((itemSetter: any, index: number) => {
        //         const setterTypeComponents = Component.filter((itemComponent) => itemComponent.name === itemSetter.type)
        //         const SetterComponent = setterTypeComponents[setterTypeComponents.length - 1]!.component
        //         return (
        //           <SetterComponent
        //             v-model={itemSetter.value}
        //             options={itemSetter.options ?? undefined}
        //             style={{ marginLeft: index > 0 ? '10px' : 0 }}
        //           />
        //         )
        //       })}
        //     </div>
        //   </div>
        // )
      } else {
        content = (
          <div class="varlet-low-code-field-body">
            <div class="varlet-low-code-field-body-title">{item.label}</div>
            <div class="varlet-low-code-field-body-content">
              {item.setters.map((itemSetter: any, index: number) => {
                const setterTypeComponents = Component.filter(
                  (itemComponent) => itemComponent.name === itemSetter.setter
                )
                const SetterComponent = setterTypeComponents[setterTypeComponents.length - 1]!.component
                return (
                  <SetterComponent
                    v-model={item.defaultValue}
                    options={itemSetter.props?.options ?? undefined}
                    style={{ marginLeft: index > 0 ? '10px' : 0 }}
                  />
                )
              })}
              <BindTypePopover
                class="varlet-low-code-field__body-setter-icon"
                v-model={item.setterType}
                options={item.options ?? undefined}
                onSelectVariable={() => openBindDialog('showCode')}
              />
            </div>
          </div>
        )
      }
      return content
    }

    return () => {
      return (
        <div class="setters-attribute-field">
          <VarCollapse v-model={values.value}>
            <VarCollapseItem title="布局" name="1">
              {props.materialsData?.attrs.map((item: AssetProfileMaterialProp) => {
                return layoutContent(item)
              })}
            </VarCollapseItem>
          </VarCollapse>
          <BindDialog v-model={showDialog.value} v-model:code={dialogCode.value} onConfirm={saveCode} />
        </div>
      )
    }
  },
})
