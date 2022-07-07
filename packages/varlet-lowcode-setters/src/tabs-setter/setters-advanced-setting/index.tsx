import { defineComponent, reactive } from 'vue'
import { AppBar as VarAppBar } from '@varlet/ui'
import { RadioSetter, SwitchSetter, InputSetter } from '../../build-in-setter/index'
import '@varlet/ui/es/app-bar/style/index.js'
import './index.less'

const typeOptions: any[] = [
  {
    value: 'BoolSetter',
    label: '0',
  },
  {
    value: '变量输入',
    label: '1',
  },
]
export default defineComponent({
  name: 'SETTERSADVANCEDSETTINGS',
  setup() {
    const formData = reactive({
      isShow: false,
      isShowType: '0',
      keyType: '0',
      key: '',
      refIdType: '0',
      refId: '',
    })
    return () => {
      return (
        <div class="setters-advanced-settings">
          <VarAppBar title="是否渲染" color="rgba(31, 56, 88, 0.06)" />
          <div class="setters-advanced-settings__content">
            <div class="setters-advanced-settings__attr">
              <RadioSetter v-model={formData.isShowType} options={typeOptions} />
            </div>
            <div class="setters-advanced-settings__attr">
              {formData.isShowType === '0' ? (
                <SwitchSetter />
              ) : (
                <div>
                  <span>已绑定</span>
                  <span>123456</span>
                </div>
              )}
            </div>
          </div>
          <VarAppBar title="唯一渲染标识" color="rgba(31, 56, 88, 0.06)" />
          <div class="setters-advanced-settings__content">
            <div class="setters-advanced-settings__attr">
              <RadioSetter v-model={formData.keyType} options={typeOptions} />
            </div>
            <div class="setters-advanced-settings__attr">
              {formData.keyType === '0' ? (
                <InputSetter v-model={formData.key} />
              ) : (
                <div>
                  <span>已绑定</span>
                  <span>123456</span>
                </div>
              )}
            </div>
          </div>
          <VarAppBar title="refId" color="rgba(31, 56, 88, 0.06)" />
          <div class="setters-advanced-settings__content">
            <div class="setters-advanced-settings__attr">
              <InputSetter v-model={formData.refId} />
            </div>
          </div>
        </div>
      )
    }
  },
})
