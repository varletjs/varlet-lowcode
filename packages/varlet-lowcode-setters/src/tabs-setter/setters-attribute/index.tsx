import { defineComponent, ref } from 'vue'
import { Icon, Collapse as VarCollapse, CollapseItem as VarCollapseItem } from '@varlet/ui'
import Component from '../../build-in-setter/index'
import '@varlet/ui/es/collapse/style/index.js'
import '@varlet/ui/es/collapse-item/style/index.js'

export default defineComponent({
  name: 'SettersAttribute',
  setup() {
    const testSettersObject = {
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
          name: 'ripple',
          description: '是否开启水波',
          setter: [
            {
              type: 'SwitchSetter',
              value: true,
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
      ],
    }
    console.log(Component, 'Component')
    const values = ref(['1'])
    return () => {
      return (
        <div class="setters-attribute-field">
          <VarCollapse v-model={values.value}>
            <VarCollapseItem title="布局" name="1">
              {testSettersObject.props.map((item) => {
                return (
                  <div class="attribute-field-body">
                    <div class="attribute-field-body-title">{item.description}</div>
                    <div class="attribute-field-body-content">
                      {item.setter.map((itemSetter: any) => {
                        let setterComponent
                        Component.forEach((itemComponent) => {
                          itemComponent.name === itemSetter.type ? (setterComponent = itemComponent.component) : null
                        })
                        return itemSetter.options ? (
                          <setterComponent
                            v-model={itemSetter.value}
                            options={itemSetter.options ? itemSetter.options : null}
                          />
                        ) : (
                          <setterComponent v-model={itemSetter.value} />
                        )
                      })}
                      <Icon name="dots-vertical" />
                    </div>
                  </div>
                )
              })}
            </VarCollapseItem>
          </VarCollapse>
        </div>
      )
    }
  },
})
