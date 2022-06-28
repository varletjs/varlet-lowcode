import { defineComponent, ref } from 'vue'
import {
  Collapse as VarCollapse,
  CollapseItem as VarCollapseItem,
  Counter as VarCounter,
  Select as VarSelect,
  Option as VarOption,
  Input as VarInput,
} from '@varlet/ui'
import '@varlet/ui/es/collapse/style/index.js'
import '@varlet/ui/es/collapse-item/style/index.js'
import '@varlet/ui/es/counter/style/index.js'
import '@varlet/ui/es/select/style/index.js'
import '@varlet/ui/es/option/style/index.js'
import '@varlet/ui/es/input/style/index.js'
import SetterRadio from './setterAttribute/setterRadio'
import './settersStyle.less'

export default defineComponent({
  name: 'SettersStyle',
  setup() {
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
    const asfas = ref('inline')
    const RenderContent = () => {
      return (
        <div class="setters-style-field">
          <VarCollapse v-model={values.value}>
            <VarCollapseItem title="布局" name="1">
              <div class="style-field-body">
                <div class="style-field-body-title">布局模式</div>
                <div class="style-field-body-content">
                  <SetterRadio v-model={asfas.value} options={options} />
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
                <div class="style-field-body-title">字号</div>
                <div class="style-field-body-content">
                  <VarCounter />
                </div>
              </div>
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title">行高</div>
                <div class="style-field-body-content">
                  <VarCounter />
                </div>
              </div>
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title">字重</div>
                <div class="style-field-body-content">
                  <VarInput placeholder="请输入字重" />
                </div>
              </div>
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title">对齐</div>
                <div class="style-field-body-content">
                  <VarSelect placeholder="请选择一个选项">
                    <VarOption label="左对齐 left" />
                    <VarOption label="居中 center" />
                    <VarOption label="右对齐 right" />
                    <VarOption label="两端对齐 justify" />
                  </VarSelect>
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
