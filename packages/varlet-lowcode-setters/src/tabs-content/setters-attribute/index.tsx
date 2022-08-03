import { defineComponent, reactive, ref, Ref } from 'vue'
import { Icon, Collapse as VarCollapse, CollapseItem as VarCollapseItem } from '@varlet/ui'
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
  },
  setup() {
    const testSettersObject = reactive({
      name: 'Card',
      description: 'A varlet button component',
      props: [
        {
          name: 'title',
          description: '卡片标题',
          setter: [
            {
              type: 'InputSetter',
              value: '789',
            },
          ],
        },
        {
          name: 'titleChildren',
          description: '子标题',
          setter: [
            {
              type: 'SwitchInputSetter',
              value: '789',
            },
          ],
        },
        {
          name: 'ripple',
          description: '开启水波',
          setter: [
            {
              type: 'SwitchSetter',
              value: true,
            },
          ],
        },
        {
          name: 'padding',
          description: '区块行距',
          setter: [
            {
              type: 'CounterSetter',
              value: 12,
            },
          ],
        },
        {
          name: 'widthType',
          description: '宽度类型',
          setter: [
            {
              type: 'RadioSetter',
              options: [
                {
                  value: '自适应',
                  label: 'adaptive',
                },
                {
                  value: '固定',
                  label: 'fixed',
                },
              ],
              value: 'adaptive',
            },
          ],
        },
        {
          name: 'titleEdit',
          description: '主标题操作',
          layout: 'singRow',
          setter: [
            {
              type: 'DraggableSetter',
              value: 12,
            },
          ],
        },
      ],
    })
    const values = ref(['1'])
    const openBindDialog = (val: string) => {
      showDialog.value = true
    }
    const showDialog = ref(false)
    const dialogCode: Ref<any> = ref()
    const saveCode = () => {
      showDialog.value = false
    }
    const layoutContent = (item: any) => {
      let content
      if (item.layout === 'singRow') {
        content = (
          <div class="varlet-low-code-field-body">
            <div class="varlet-low-code-field-body-content__sing-row">
              <div class="varlet-low-code-field-body-title">{item.description}</div>
              <Icon name="dots-vertical" class="varlet-low-code-field-body__setter-icon" />
            </div>
            <div class="varlet-low-code-field-body-content__sing-row">
              {item.setter.map((itemSetter: any, index: number) => {
                const setterTypeComponents = Component.filter((itemComponent) => itemComponent.name === itemSetter.type)
                const SetterComponent = setterTypeComponents[setterTypeComponents.length - 1]!.component
                return (
                  <SetterComponent
                    v-model={itemSetter.value}
                    options={itemSetter.options ?? undefined}
                    style={{ marginLeft: index > 0 ? '10px' : 0 }}
                  />
                )
              })}
            </div>
          </div>
        )
      } else {
        content = (
          <div class="varlet-low-code-field-body">
            <div class="varlet-low-code-field-body-title">{item.description}</div>
            <div class="varlet-low-code-field-body-content">
              {item.setter.map((itemSetter: any, index: number) => {
                const setterTypeComponents = Component.filter((itemComponent) => itemComponent.name === itemSetter.type)
                const SetterComponent = setterTypeComponents[setterTypeComponents.length - 1]!.component
                return (
                  <SetterComponent
                    v-model={itemSetter.value}
                    options={itemSetter.options ?? undefined}
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
              {testSettersObject.props.map((item) => {
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
