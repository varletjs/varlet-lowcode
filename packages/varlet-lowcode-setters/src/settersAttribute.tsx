import { defineComponent } from 'vue'
import { Icon } from '@varlet/ui'
import Component from './settersComponent'

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
              type: 'SetterInput',
              value: '789',
            },
          ],
        },
        {
          name: 'ripple',
          description: '是否开启水波',
          setter: [
            {
              type: 'SetterSwitch',
              value: true,
            },
          ],
        },
        {
          name: 'widthType',
          description: '宽度类型',
          setter: [
            {
              type: 'SetterRadio',
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
    return () => {
      return (
        <div class="setters-attribute-field">
          <div class="attribute-field-head">
            <span>样式</span>
            <Icon name="chevron-down" />
          </div>
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
        </div>
      )
    }
  },
})
