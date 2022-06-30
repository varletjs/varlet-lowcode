import { defineComponent, reactive, ref } from 'vue'
import {
  Collapse as VarCollapse,
  CollapseItem as VarCollapseItem,
  Counter as VarCounter,
  Select as VarSelect,
  Option as VarOption,
  Input as VarInput,
  Slider as VarSlider,
} from '@varlet/ui'
import SetterRadio from './setterAttribute/setterRadio'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import '@varlet/touch-emulator'
import '@varlet/ui/es/collapse/style/index.js'
import '@varlet/ui/es/collapse-item/style/index.js'
import '@varlet/ui/es/counter/style/index.js'
import '@varlet/ui/es/select/style/index.js'
import '@varlet/ui/es/option/style/index.js'
import '@varlet/ui/es/input/style/index.js'
import '@varlet/ui/es/slider/style/index.js'
import './settersStyle.less'

export default defineComponent({
  name: 'SettersStyle',
  setup() {
    const pureColor = ref('#71afe5')
    const values = ref(['2'])
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
    const formData = reactive({
      opacity: 50,
      textAlign: 'center',
      disable: '',
      fontWeight: '200',
    })
    const isReady = ref(false)

    const RenderContent = () => {
      return (
        <div class="setters-style-field">
          <VarCollapse v-model={values.value}>
            <VarCollapseItem title="布局" name="1">
              <div class="style-field-body">
                <div class="style-field-body-title">布局模式</div>
                <div class="style-field-body-content">
                  <SetterRadio v-model={formData.disable} options={options} />
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
                  <VarInput placeholder="请输入字重" v-model={formData.fontWeight} />
                </div>
              </div>
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title style-field-body-title-transform">对齐:</div>
                <div class="style-field-body-content">
                  <VarSelect v-model={formData.textAlign} placeholder="请选择一个选项">
                    <VarOption label="left">左对齐 left</VarOption>
                    <VarOption label="center">居中 center</VarOption>
                    <VarOption label="right">右对齐 right</VarOption>
                    <VarOption label="justify">两端对齐 justify</VarOption>
                  </VarSelect>
                </div>
              </div>
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title">透明度:</div>
                <div class="style-field-body-content">
                  <VarSlider v-model={formData.opacity} />
                </div>
              </div>
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title">文字颜色:</div>
                <div class="style-field-body-content">
                  {/* <div class={'current-color'} onClick={()=>isReady.value = true}></div> */}
                  {/* {isReady.value ? <ColorPicker v-model:pureColor={pureColor.value} /> : null} */}
                  <ColorPicker v-model:pureColor={pureColor.value} />
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
