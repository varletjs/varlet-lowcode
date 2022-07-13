import { defineComponent, reactive, ref, Ref, watchEffect } from 'vue'
import { AppBar as VarAppBar, Icon } from '@varlet/ui'
import { SwitchSetter, InputSetter } from '../../built-in-setters/index'
import BindTypePopover from '../../component/bind-type/index.vue'
import BindDialog from '../../component/dialog-setter/index'
import '@varlet/ui/es/app-bar/style/index.js'
import './index.less'

export default defineComponent({
  name: 'SETTERSADVANCEDSETTINGS',
  setup() {
    const formData: any = reactive({
      isShow: false,
      isShowType: 'Setter',
      keyType: 'Setter',
      key: '',
      refId: '',
      showCode: '123456123456',
      keyCode: '888898978974545',
    })
    const showDialog = ref(false)
    const dialogCode: Ref<string> = ref('')
    const selectContent: Ref<string> = ref('')
    const openBindDialog = (val: string) => {
      dialogCode.value = formData[val]

      showDialog.value = true
      selectContent.value = val
    }

    watchEffect(() => {
      console.log(123)
    })

    const appBarSlots = {
      right: () => {
        return <BindTypePopover v-model={formData.isShowType} onSelectVariable={() => openBindDialog('showCode')} />
      },
    }

    const keySlots = {
      right: () => {
        return <BindTypePopover v-model={formData.keyType} onSelectVariable={() => openBindDialog('keyCode')} />
      },
    }
    const saveCode = () => {
      formData[selectContent.value] = dialogCode.value
    }
    return () => {
      return (
        <div class="setters-advanced-settings">
          <VarAppBar title="是否渲染" color="rgba(31, 56, 88, 0.06)" text-color="#000" v-slots={appBarSlots} />
          <div class="setters-advanced-settings__content">
            <div class="setters-advanced-settings__attr">
              {formData.isShowType === 'Setter' ? (
                <SwitchSetter v-model={formData.isShow} />
              ) : (
                <div onClick={() => openBindDialog('showCode')} class="setters-advanced-settings__bind-content">
                  已绑定:
                  <br />
                  {formData.showCode}
                </div>
              )}
            </div>
          </div>
          <VarAppBar title="唯一渲染标识" color="rgba(31, 56, 88, 0.06)" text-color="#000" v-slots={keySlots} />
          <div class="setters-advanced-settings__content">
            <div class="setters-advanced-settings__attr">
              {formData.keyType === 'Setter' ? (
                <InputSetter v-model={formData.key} />
              ) : (
                <div onClick={() => openBindDialog('keyCode')} class="setters-advanced-settings__bind-content">
                  已绑定:
                  <br />
                  {formData.keyCode}
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
          <VarAppBar title="循环" color="rgba(31, 56, 88, 0.06)" text-color="#000" />
          <div class="setters-advanced-settings__content">
            <div class="setters-attribute-field">
              <div class="attribute-field-body">
                <div class="attribute-field-body-title">循环数据</div>
                <div class="attribute-field-body-content">
                  {/* <div>231546</div> */}
                  <Icon name="dots-vertical" />
                </div>
              </div>
              <div class="attribute-field-body">
                <div class="attribute-field-body-title">迭代变量名</div>
                <div class="attribute-field-body-content">
                  <InputSetter v-model={formData.key} />
                  <Icon name="dots-vertical" />
                </div>
              </div>
              <div class="attribute-field-body">
                <div class="attribute-field-body-title">索引变量名</div>
                <div class="attribute-field-body-content">
                  <InputSetter v-model={formData.key} />
                  {/* <Icon name="dots-vertical" /> */}
                  <span>
                    <BindTypePopover
                      v-model={formData.isShowType}
                      onSelectVariable={() => openBindDialog('showCode')}
                    />
                  </span>
                </div>
              </div>
              <div class="attribute-field-body">
                <div class="attribute-field-body-title">循环 Key</div>
                <div class="attribute-field-body-content">
                  <InputSetter v-model={formData.key} />
                  <Icon name="dots-vertical" />
                </div>
              </div>
            </div>
          </div>
          <BindDialog v-model={showDialog.value} v-model:code={dialogCode.value} onConfirm={saveCode} />
        </div>
      )
    }
  },
})
