import { defineComponent, nextTick, reactive } from 'vue'
import './index.less'

export default defineComponent({
  name: 'StyleInput',
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return {
          margin: {},
          padding: {},
        }
      },
    },
    positionValue: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const boxData: any = reactive({
      margin: {
        left: '',
        top: '',
        right: '',
        bottom: '',
      },
      padding: {
        left: '',
        top: '',
        right: '',
        bottom: '',
      },
    })
    const inputContent = (val: any, str: string, type: string) => {
      const obj: Record<string, any> = {}
      obj[str] = val.target.value.length * 7.5
      if (obj[str] < 20) {
        obj[str] = 20
      } else if (obj[str] > 120) {
        obj[str] = 120
      }
      if (str === 'right' || str === 'left') {
        document.documentElement.style.setProperty(
          `--${type === 'margin' ? 'margin' : 'padding'}-theme-${str}-width`,
          obj[str] + 'px'
        )
      }
    }
    const blurInput = async (val: any, str: string, type: string) => {
      if (!Number.isNaN(Number(val.target.value)) && val.target.value !== '') {
        boxData[type][str] = Number(val.target.value) + 'px'
      } else {
        boxData[type][str] = val.target.value
      }
      if (val.target.value !== '') {
        const newData = JSON.parse(JSON.stringify(props.modelValue))
        newData[type][str] = JSON.parse(JSON.stringify(boxData[type][str]))
        emit('update:modelValue', newData)
      }
      await nextTick()
      boxData[type][str] = ''
      val.target.value = ''
      inputContent(val, str, type)
    }
    return () => {
      return (
        <div style={{ width: '100%' }}>
          <div class="position-value">
            <span class="position-value__title">margin:</span>
            {Object.keys(props.modelValue).map((item) => {
              return props.modelValue[item] === '' ? (
                <span style={{ marginRight: '10px' }}>auto</span>
              ) : (
                <span style={{ marginRight: '10px' }}>{props.modelValue[item]}</span>
              )
            })}
          </div>
          <div class="position-value">
            <span class="position-value__title">padding:</span>
            {Object.keys(props.modelValue).map((item) => {
              return props.modelValue[item] === '' ? (
                <span style={{ marginRight: '10px' }}>auto</span>
              ) : (
                <span style={{ marginRight: '10px' }}>{props.modelValue[item]}</span>
              )
            })}
          </div>
          <div class="varlet-low-code__box-container">
            <div class="varlet-low-code__margin-top-div">
              <span class="varlet-low-code__explain-txt">MARGIN</span>
              <span class="next-input">
                <input type="text" onBlur={(e) => blurInput(e, 'top', 'margin')} />
              </span>
            </div>
            <div class="varlet-low-code__margin-right-div">
              <span class="next-input">
                <input
                  type="text"
                  onInput={(e) => inputContent(e, 'right', 'margin')}
                  onBlur={(e) => blurInput(e, 'right', 'margin')}
                />
              </span>
            </div>
            <div class="varlet-low-code__margin-bottom-div">
              <span class="next-input">
                <input type="text" onBlur={(e) => blurInput(e, 'bottom', 'margin')} />
              </span>
            </div>
            <div class="varlet-low-code__margin-left-div">
              <span class="next-input">
                <input
                  type="text"
                  onInput={(e) => inputContent(e, 'left', 'margin')}
                  onBlur={(e) => blurInput(e, 'left', 'margin')}
                />
              </span>
            </div>
            <div class="varlet-low-code__padding">
              <div class="varlet-low-code__padding-top-div">
                <span class="varlet-low-code__explain-txt">PADDING</span>
                <span class="next-input">
                  <input type="text" onBlur={(e) => blurInput(e, 'top', 'padding')} />
                </span>
              </div>
              <div class="varlet-low-code__padding-right-div">
                <span class="next-input">
                  <input
                    type="text"
                    onInput={(e) => inputContent(e, 'right', 'padding')}
                    onBlur={(e) => blurInput(e, 'right', 'padding')}
                  />
                </span>
              </div>
              <div class="varlet-low-code__padding-bottom-div">
                <span class="next-input">
                  <input type="text" onBlur={(e) => blurInput(e, 'bottom', 'padding')} />
                </span>
              </div>
              <div class="varlet-low-code__padding-left-div">
                <span class="next-input">
                  <input
                    type="text"
                    onInput={(e) => inputContent(e, 'left', 'padding')}
                    onBlur={(e) => blurInput(e, 'left', 'padding')}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  },
})
