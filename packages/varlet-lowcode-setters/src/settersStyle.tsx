import { defineComponent } from 'vue'
import { Icon } from '@varlet/ui'
import Component from './settersComponent'

export default defineComponent({
  name: 'SettersStyle',
  setup() {
    const testSettersObject = {
      name: 'Card',
      description: 'A varlet button component',
      props: [
        {
          name: 'title',
          description: '卡片标题',
          setter: ['SetterInput'],
        },
        {
          name: 'ripple',
          description: '是否开启水波',
          setter: ['SetterSwitch'],
        },
        {
          name: 'widthType',
          description: '宽度类型',
          setter: ['SetterRadio'],
        },
      ],
    }
    return () => {
      return (
        <div class="setters-style-field">
          <div class="style-field-head">
            <span>样式</span>
            <Icon name="chevron-down" />
          </div>
          {testSettersObject.props.map((item) => {
            return (
              <div class="style-field-body">
                <div class="style-field-body-title">{item.description}</div>
                <div class="style-field-body-content">
                  {/* {item.setter.map((item) => {
                  if (Object.prototype.toString.call(item) === '[object String]') {
                    let setterComponent
                    Component.map((itemComponent) => {
                      console.log(itemComponent,'itemComponent')
                      itemComponent.name === item ? setterComponent = itemComponent.component : null
                    })
                    return <setterComponent />
                  } else {
                    return 132456
                  }
                })} */}
                  {/* <SetterInput /> */}
                  <Icon name="dots-vertical" />
                </div>
              </div>
            )
          })}
          {/* <div class="style-field-body">
            <div class="style-field-body-title">头部分割线</div>
            <div class="style-field-body-content">
              <StyleSwitch v-model={testSwitch.value} />
              <Icon name="dots-vertical" />
            </div>
          </div>
          <div class="style-field-body">
            <div class="style-field-body-title">宽度类型</div>
            <div class="style-field-body-content">
              <StyleRadio v-model={testRadio.value} />
              <Icon name="dots-vertical" />
            </div>
          </div> */}
        </div>
      )
    }
  },
})
