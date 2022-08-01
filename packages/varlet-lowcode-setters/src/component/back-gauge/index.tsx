import { defineComponent, nextTick, reactive } from 'vue'
import './index.less'

export default defineComponent({
  name: 'StyleInput',
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return {}
      },
    },
    positionValue: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const positionVal: Record<string, any> = reactive({
      left: '',
      top: '',
      right: '',
      bottom: '',
    })
    const inputContent = (val: any, str: string) => {
      const obj: Record<string, any> = {}
      obj[str] = val.target.value.length * 7.5
      if (obj[str] < 30) {
        obj[str] = 30
      } else if (obj[str] > 200) {
        obj[str] = 200
      }
      if (str === 'right' || str === 'left') {
        document.documentElement.style.setProperty(`--position-theme-${str}-width`, obj[str] + 'px')
      }
    }
    const blurInput = async (val: any, str: string) => {
      if (!Number.isNaN(Number(val.target.value)) && val.target.value !== '') {
        positionVal[str] = Number(val.target.value) + 'px'
      } else {
        positionVal[str] = val.target.value
      }
      if (val.target.value !== '') {
        const newData = JSON.parse(JSON.stringify(props.modelValue))
        newData[str] = JSON.parse(JSON.stringify(positionVal[str]))
        emit('update:modelValue', newData)
      }
      await nextTick()
      positionVal[str] = ''
      val.target.value = ''
      inputContent(val, str)
    }
    return () => {
      return (
        <div style={{ width: '100%' }}>
          <div class="position-value">
            <span class="position-value__title">{props.positionValue}:</span>
            {Object.keys(props.modelValue).map((item) => {
              return props.modelValue[item] === '' ? (
                <span style={{ marginRight: '10px' }}>auto</span>
              ) : (
                <span style={{ marginRight: '10px' }}>{props.modelValue[item]}</span>
              )
            })}
          </div>
          <div class="layout-box-container">
            <div class="margin-top-div">
              <span class="explain-txt">MARGIN</span>
              <span class="next-input">
                <input type="text" />
              </span>
            </div>
            <div class="margin-right-div">
              <span class="next-input">
                <input type="text" />
              </span>
            </div>
            <div class="margin-bottom-div">
              <span class="next-input">
                <input type="text" />
              </span>
            </div>
            <div class="margin-left-div">
              <span class="next-input">
                <input type="text" />
              </span>
            </div>
            <div class="padding-top-div">
              <span class="explain-txt">PADDING</span>
              <span class="next-input">
                <input type="text" />
              </span>
            </div>
            <div class="padding-right-div">
              <span class="next-input">
                <input type="text" />
              </span>
            </div>
            <div class="padding-bottom-div">
              <span class="next-input">
                <input type="text" />
              </span>
            </div>
            <div class="padding-left-div">
              <span class="next-input">
                <input type="text" />
              </span>
            </div>
          </div>
        </div>
      )
    }
  },
})
