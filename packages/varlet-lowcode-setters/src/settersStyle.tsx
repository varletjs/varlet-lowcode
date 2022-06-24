import { eventsManager } from '@varlet/lowcode-core'
import { CSSProperties, reactive, Ref , onMounted, onUnmounted, defineComponent, ref } from 'vue'
import { Icon } from '@varlet/ui'
import StyleInput from './settersStyle/styleInput'
import StyleSwitch from './settersStyle/styleSwitch'
import StyleRadio from './settersStyle/styleRadio'

export default defineComponent({
  name: 'SettersStyle',
  setup() {
    const testSettersObject = reactive({
      options: {},
    })
    testSettersObject.options = {
      attr: [
        {
          name: '绑定的值',
          type: 'settersInput',
          value: '',
          parameter: 'v-model',
        },
        {
          name: '占位符',
          type: 'settersInput',
          value: '',
          parameter: 'placeholder',
        },
        {
          name: '绑定的值',
          type: 'settersInput',
          value: '',
          parameter: 'type',
        },
        {
          name: '输入框类型',
          type: 'settersRadio',
          options: [
            {
              value: 'text',
            },
            {
              value: 'password',
            },
            {
              value: 'number',
            },
          ],
          value: '',
        },
      ],
      // on: {
      //   click: () => {
      //     console.log(123546)
      //   },
      // }
    }
    const testText = ref('123456')
    const testBol = ref(false)
    const testRadio = ref('adaptive')
    return () => {
      return (
        <div class="setters-style-field">
          <div class="style-field-head">
            <span>样式</span>
            <Icon name="chevron-down" />
          </div>
          <div class="style-field-body">
            <div class="style-field-body-title">区块模式</div>
            <div class="style-field-body-content">
              <StyleInput v-model={testText.value} />
              <Icon name="dots-vertical" />
            </div>
          </div>
          <div class="style-field-body">
            <div class="style-field-body-title">头部分割线</div>
            <div class="style-field-body-content">
              <StyleSwitch v-model={testBol.value} />
              <Icon name="dots-vertical" />
            </div>
          </div>
          <div class="style-field-body">
            <div class="style-field-body-title">宽度类型</div>
            <div class="style-field-body-content">
              <StyleRadio v-model={testRadio.value} />
              <Icon name="dots-vertical" />
            </div>
          </div>
        </div>
      )
    }
  },
})
