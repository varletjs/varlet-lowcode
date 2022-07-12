import { defineComponent, reactive, ref } from 'vue'
import { Collapse as VarCollapse, CollapseItem as VarCollapseItem, Counter as VarCounter } from '@varlet/ui'
import { RadioSetter, SelectSetter, InputSetter, SliderSetter } from '../../built-in-setters/index'
import SetterPosition from '../../built-in-setters/positon-setter/index'
import Popover from '../../component/popover/popover'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import '@varlet/ui/es/collapse/style/index.js'
import '@varlet/ui/es/collapse-item/style/index.js'
import '@varlet/ui/es/counter/style/index.js'
import '@varlet/ui/es/option/style/index.js'
import '@varlet/ui/es/slider/style/index.js'
import './index.less'

const positionOptions = [
  { value: 'static', label: 'static' },
  { value: 'relative', label: 'relative' },
  { value: 'absolute', label: 'absolute' },
  { value: 'fixed', label: 'fixed' },
  { value: 'sticky', label: 'sticky' },
]
const optionsBg = [
  { value: '颜色填充', label: 0 },
  { value: '背景图片', label: 1 },
]
const options = [
  {
    value: 'inline',
    label: 'inline',
  },
  {
    value: 'flex',
    label: 'flex',
  },
  {
    value: 'block',
    label: 'block',
  },
  {
    value: 'inline-block',
    label: 'inline-block',
  },
  {
    value: 'none',
    label: 'none',
  },
]
const floatOptions = [
  { value: '不浮动 none', label: 'none' },
  { value: '左浮动 left', label: 'left' },
  { value: '右浮动 right', label: 'right' },
]
const clearOptions = [
  { value: '不清除 none', label: 'none' },
  { value: '左清除 left', label: 'left' },
  { value: '右清除 right', label: 'right' },
  { value: '全部清除 both', label: 'both' },
]
const textAlignOptions = [
  { value: '左对齐 left', label: 'left' },
  { value: '居中 center', label: 'center' },
  { value: '右对齐 right', label: 'right' },
  { value: '两端对齐 justify', label: 'justify' },
]
export default defineComponent({
  name: 'SettersStyle',
  setup() {
    const pureColor = ref('#71afe5')
    const values = ref(['4'])
    const formData = reactive({
      opacity: 50,
      textAlign: 'center',
      disable: '',
      fontWeight: '200',
      background: '',
      backgroundIndex: 0,
      position: '',
      positionData: {
        left: '',
        top: '',
        right: '',
        bottom: '',
      },
      float: '',
      clear: '',
    })
    const isReady = ref(false)
    const childrenSlot = reactive({
      default: () => {
        return (
          <div
            class={'current-color'}
            onClick={() => {
              isReady.value = !isReady.value
            }}
          />
        )
      },
      content: () => (
        <div onClick={(e) => e.stopPropagation()}>
          <ColorPicker v-model:pureColor={pureColor.value} isWidget />
        </div>
      ),
    })

    const RenderContent = () => {
      return (
        <div class="setters-style-field">
          <VarCollapse v-model={values.value}>
            <VarCollapseItem title="布局" name="1">
              <div class="style-field-body">
                <div class="style-field-body-title">布局模式</div>
                <div class="style-field-body-content">
                  <RadioSetter v-model={formData.disable} options={options} />
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
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title">宽度</div>
                <div class="style-field-body-content">
                  <VarCounter />
                </div>
              </div>
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title">高度</div>
                <div class="style-field-body-content">
                  <VarCounter />
                </div>
              </div>
            </VarCollapseItem>
            <VarCollapseItem title="文字" name="2">
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title">字号:</div>
                <div class="style-field-body-content">
                  <VarCounter />
                </div>
              </div>
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title">行高:</div>
                <div class="style-field-body-content">
                  <VarCounter />
                </div>
              </div>
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title style-field-body-title-transform">字重:</div>
                <div class="style-field-body-content">
                  <InputSetter v-model={formData.fontWeight} attr={{ clearable: true }} />
                </div>
              </div>
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title style-field-body-title-transform">对齐:</div>
                <div class="style-field-body-content">
                  <SelectSetter v-model={formData.textAlign} options={textAlignOptions} attr={{ clearable: true }} />
                </div>
              </div>
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title">透明度:</div>
                <div class="style-field-body-content">
                  <SliderSetter v-model={formData.opacity} />
                </div>
              </div>
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title">文字颜色:</div>
                <div class="style-field-body-content">
                  <Popover v-slots={childrenSlot}></Popover>
                </div>
              </div>
            </VarCollapseItem>
            <VarCollapseItem title="背景" name="3">
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title">背景类型:</div>
                <div class="style-field-body-content">
                  <RadioSetter v-model={formData.backgroundIndex} options={optionsBg} />
                </div>
              </div>
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title"></div>
                <div class="style-field-body-content">
                  {formData.backgroundIndex === 0 ? (
                    <Popover v-slots={childrenSlot}></Popover>
                  ) : (
                    <InputSetter v-model={formData.background} attr={{ placeholder: '请输入链接' }} />
                  )}
                </div>
              </div>
            </VarCollapseItem>
            <VarCollapseItem title="定位" name="4">
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title style-field-body-title-transform">定位类型:</div>
                <div class="style-field-body-content">
                  <SelectSetter v-model={formData.position} options={positionOptions} attr={{ clearable: true }} />
                </div>
              </div>
              {formData.position !== '' && formData.position !== 'static' ? (
                <div class="style-field-body">
                  <div class="style-field-body-content">
                    <SetterPosition v-model={formData.positionData} positionValue={formData.position} />
                  </div>
                </div>
              ) : null}

              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title">叠成顺序:</div>
                <div class="style-field-body-content">
                  <VarCounter />
                </div>
              </div>
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title style-field-body-title-transform">浮动方向:</div>
                <div class="style-field-body-content">
                  <SelectSetter v-model={formData.float} options={floatOptions} attr={{ clearable: true }} />
                </div>
              </div>
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title style-field-body-title-transform">清除:</div>
                <div class="style-field-body-content">
                  <SelectSetter v-model={formData.clear} options={clearOptions} attr={{ clearable: true }} />
                </div>
              </div>
            </VarCollapseItem>
          </VarCollapse>
        </div>
      )
    }
    return () => {
      return RenderContent()
    }
  },
})
