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
          <div class="position-box">
            <div class="position-top-div">
              <span class="position-top-div__next-input position-box__next-input">
                <input value={positionVal.top} type="text" placeholder="-" onBlur={(e) => blurInput(e, 'top')} />
              </span>
            </div>
            <div class="position-right-div">
              <span class="position-right-div__next-input position-box__next-input">
                <input
                  value={positionVal.right}
                  type="text"
                  placeholder="-"
                  onInput={(e) => inputContent(e, 'right')}
                  onBlur={(e) => blurInput(e, 'right')}
                />
              </span>
            </div>
            <div class="position-bottom-div">
              <span class="position-bottom-div__next-input position-box__next-input">
                <input value={positionVal.bottom} type="text" placeholder="-" onBlur={(e) => blurInput(e, 'bottom')} />
              </span>
            </div>
            <div class="position-left-div">
              <span class="position-left-div__next-input position-box__next-input">
                <input
                  value={positionVal.left}
                  type="text"
                  placeholder="-"
                  onInput={(e) => inputContent(e, 'left')}
                  onBlur={(e) => blurInput(e, 'left')}
                />
              </span>
            </div>
          </div>
        </div>
      )
    }
  },
})
