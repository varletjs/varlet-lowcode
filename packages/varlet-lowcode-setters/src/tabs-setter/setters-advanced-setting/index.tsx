import { defineComponent, reactive, ref, Ref, watchEffect } from 'vue'
import { AppBar as VarAppBar } from '@varlet/ui'
import { RadioSetter, SwitchSetter, InputSetter } from '../../built-in-setters/index'
import Dialog from '../../component/dialog-setter/index'
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
      refId: '',
    })
    const showDialog = ref(false)
    watchEffect(() => {
      formData.isShowType === '1' ? (showDialog.value = true) : null
    })
    watchEffect(() => {
      formData.keyType === '1' ? (showDialog.value = true) : null
    })

    return () => {
      return (
        <div class="setters-advanced-settings">
          <VarAppBar title="是否渲染" color="rgba(31, 56, 88, 0.06)" text-color="#000" />
          <div class="setters-advanced-settings__content">
            <div class="setters-advanced-settings__attr">
              <RadioSetter v-model={formData.isShowType} options={typeOptions} />
            </div>
            <div class="setters-advanced-settings__attr">
              {formData.isShowType === '0' ? (
                <SwitchSetter v-model={formData.isShow} />
              ) : (
                <div>
                  <a>已绑定</a>
                  <span>123456</span>
                </div>
              )}
            </div>
          </div>
          <VarAppBar title="唯一渲染标识" color="rgba(31, 56, 88, 0.06)" text-color="#000" />
          <div class="setters-advanced-settings__content">
            <div class="setters-advanced-settings__attr">
              <RadioSetter v-model={formData.keyType} options={typeOptions} />
            </div>
            <div class="setters-advanced-settings__attr">
              {formData.keyType === '0' ? (
                <InputSetter v-model={formData.key} />
              ) : (
                <div>
                  <a>已绑定</a>
                  <span>123456</span>
                </div>
              )}
            </div>
          </div>
          <VarAppBar title="refId" color="rgba(31, 56, 88, 0.06)" text-color="#000" />
          <div class="setters-advanced-settings__content">
            <div class="setters-advanced-settings__attr">
              <InputSetter v-model={formData.refId} />
            </div>
          </div>
          <Dialog v-model={showDialog.value} />
        </div>
      )
    }
  },
})
