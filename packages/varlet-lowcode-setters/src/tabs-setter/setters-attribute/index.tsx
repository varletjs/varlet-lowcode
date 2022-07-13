import { defineComponent, reactive, ref } from 'vue'
import { Icon, Collapse as VarCollapse, CollapseItem as VarCollapseItem } from '@varlet/ui'
import Component from '../../built-in-setters/index'
import '@varlet/ui/es/collapse/style/index.js'
import '@varlet/ui/es/collapse-item/style/index.js'

export default defineComponent({
  name: 'SettersAttribute',
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
              type: 'SwitchSetter',
              value: false,
            },
            {
              type: 'InputSetter',
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
      ],
    })

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
                      {item.setter.map((itemSetter: any, index) => {
                        const setterTypeComponents = Component.filter(
                          (itemComponent) => itemComponent.name === itemSetter.type
                        )
                        const SetterComponent = setterTypeComponents[setterTypeComponents.length - 1]!.component
                        return (
                          <SetterComponent
                            v-model={itemSetter.value}
                            options={itemSetter.options ?? undefined}
                            style={{ marginLeft: index > 0 ? '10px' : 0 }}
                          />
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
