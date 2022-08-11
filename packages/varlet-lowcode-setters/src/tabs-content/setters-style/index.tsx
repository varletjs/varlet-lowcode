import { defineComponent, reactive, ref } from 'vue'
import { Collapse as VarCollapse, CollapseItem as VarCollapseItem, Icon } from '@varlet/ui'
import Component, { RadioSetter, SelectSetter, InputSetter, SliderSetter, CounterSetter } from '../../built-in-setters/index'
import SetterPosition from '../../built-in-setters/positon-setter/index'
import Popover from '../../component/popover/popover'
import { AssetProfileMaterialProp } from '@varlet/lowcode-core'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import '@varlet/ui/es/collapse/style/index.js'
import '@varlet/ui/es/collapse-item/style/index.js'
import '@varlet/ui/es/counter/style/index.js'
import '@varlet/ui/es/option/style/index.js'
import '@varlet/ui/es/slider/style/index.js'
import './index.less'

const styleMaterials = [
  {
    name: 'style:type',
    label: '状态',
    defaultValue: 'default',
    setters: [
      {
        setter: 'SelectSetter',
        props: {
          options: [
            {
              value: '默认状态',
              label: 'default',
            },
            {
              value: ':hover',
              label: ':hover',
            },
            {
              value: ':focus',
              label: ':focus',
            },
            {
              value: ':active',
              label: ':active',
            },
          ],
        },
      },
    ],
  },
  {
    name: 'style:width',
    label: '宽',
    defaultValue: '350px',
    setters: [
      {
        setter: 'InputSetter',
      },
    ],
  },
  {
    name: 'style:height',
    label: '高',
    defaultValue: '350px',
    setters: [
      {
        setter: 'InputSetter',
      },
    ],
  },
  {
    name: 'style:display',
    label: '显示',
    defaultValue: '350px',
    setters: [
      {
        setter: 'SelectSetter',
        props: {
          options: [
            {
              value: 'block',
              label: 'block',
            },
            {
              value: 'inline-block',
              label: 'inline-block',
            },
            {
              value: 'inline',
              label: 'inline',
            },
            {
              value: 'flex',
              label: 'flex',
            },
          ],
        },
      },
    ],
  },
  {
    name: 'style:flex-direction',
    label: '方向',
    defaultValue: '350px',
    visible: (values: any) => {
      return values.display === 'flex'
    },
    setters: [
      {
        setter: 'SelectSetter',
        props: {
          options: [
            {
              value: 'Direction:row',
              label: 'row',
            },
            {
              value: 'Direction:column',
              label: 'column',
            },
            {
              value: 'Direction:row-reverse',
              label: 'row-reverse',
            },
            {
              value: 'Direction:column-reverse',
              label: 'column-reverse',
            },
          ],
        },
      },
    ],
  },
  {
    name: 'style:align-items',
    label: '上下',
    defaultValue: 'flex-start',
    visible: (values: any) => {
      return values.display === 'flex'
    },
    setters: [
      {
        setter: 'SelectSetter',
        props: {
          options: [
            {
              value: 'Align:flex-start',
              label: 'flex-start',
            },
            {
              value: 'Align:center',
              label: 'center',
            },
            {
              value: 'Align:flex-end',
              label: 'flex-end',
            },
            {
              value: 'Align:stretch',
              label: 'stretch',
            },
            {
              value: 'Align:baseline',
              label: 'baseline',
            },
          ],
        },
      },
    ],
  },
  {
    name: 'style:justify-content',
    label: '左右',
    defaultValue: '350px',
    visible: (values: any) => {
      return values.display === 'flex'
    },
    setters: [
      {
        setter: 'SelectSetter',
        props: {
          options: [
            {
              value: 'Justify:flex-start',
              label: 'flex-start',
            },
            {
              value: 'Justify:center',
              label: 'center',
            },
            {
              value: 'Justify:flex-end',
              label: 'flex-end',
            },
            {
              value: 'Justify:space-between',
              label: 'space-between',
            },
            {
              value: 'Justify:space-around',
              label: 'space-around',
            },
          ],
        },
      },
    ],
  },
]
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
  props: {
    schemaId: {
      type: String,
    },
  },
  setup() {
    const pureColor = ref('#71afe5')
    const values = ref(['1'])
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

    const layoutContent = (item: any) => {
      let content
      if (item.layout === 'singRow') {
        content = (
          <div class="varlet-low-code-field-body">
            <div class="varlet-low-code-field-body-content__sing-row">
              <div class="varlet-low-code-field-body-title">{item.description}</div>
              <Icon name="dots-vertical" class="varlet-low-code-field-body__setter-icon" />
            </div>
            <div class="varlet-low-code-field-body-content__sing-row">
              {item.setters.map((itemSetter: any, index: number) => {
                const setterTypeComponents = Component.filter((itemComponent) => itemComponent.name === itemSetter.type)
                const SetterComponent = setterTypeComponents[setterTypeComponents.length - 1]!.component
                return (
                  <SetterComponent
                    v-model={itemSetter.value}
                    options={itemSetter.options ?? undefined}
                    style={{ marginLeft: index > 0 ? '10px' : 0 }}
                  />
                )
              })}
            </div>
          </div>
        )
      } else {
        content = (
          <div class="varlet-low-code-field-body">
            <div class="varlet-low-code-field-body-title">{item.label}</div>
            <div class="varlet-low-code-field-body-content varlet-low-code-field-body__content-style">
              {item.setters.map((itemSetter: any, index: number) => {
                const setterTypeComponents = Component.filter(
                  (itemComponent) => itemComponent.name === itemSetter.setter
                )
                const SetterComponent = setterTypeComponents[setterTypeComponents.length - 1]!.component
                return (
                  <SetterComponent
                    setter={item}
                    options={itemSetter.props?.options ?? undefined}
                    style={{ marginLeft: index > 0 ? '10px' : 0 }}
                  />
                )
              })}
            </div>
          </div>
        )
      }
      return content
    }

    const RenderContent = () => {
      return (
        <div class="setters-style-field">
          <VarCollapse v-model={values.value}>
            <VarCollapseItem title="样式布局" name="1">
              {styleMaterials.map((item: AssetProfileMaterialProp) => {
                if (item.visible) {
                  return null
                }
                return layoutContent(item)
              })}
            </VarCollapseItem>

            {/* <VarCollapseItem title="文字" name="2">
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title">字号:</div>
                <div class="style-field-body-content">
                  <CounterSetter />
                </div>
              </div>
              <div class="style-field-body style-field-body-flex">
                <div class="style-field-body-title">行高:</div>
                <div class="style-field-body-content">
                  <CounterSetter />
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
                  <CounterSetter />
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
            </VarCollapseItem> */}
          </VarCollapse>
        </div>
      )
    }
    return () => {
      return RenderContent()
    }
  },
})
