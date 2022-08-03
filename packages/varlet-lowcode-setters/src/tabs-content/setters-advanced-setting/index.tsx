import { defineComponent, reactive, ref, Ref, watchEffect } from 'vue'
import { AppBar as VarAppBar, Icon } from '@varlet/ui'
import { SwitchSetter, InputSetter, TextSetter } from '../../built-in-setters/index'
import BindTypePopover from '../../component/bind-type/index'
import BindDialog from '../../component/dialog-setter/index'
import '@varlet/ui/es/app-bar/style/index.js'
import './index.less'

export default defineComponent({
  name: 'SETTERSADVANCEDSETTINGS',
  props: {
    schemaId: {
      type: String,
    },
  },
  setup(props) {
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
        <div class="varlet-low-code-setters-advanced-settings">
          <VarAppBar title="是否渲染" color="rgba(31, 56, 88, 0.06)" text-color="#000" v-slots={appBarSlots} />
          <div class="varlet-low-code-setters-advanced-settings__content">
            <div class="varlet-low-code-setters-advanced-settings__attr">
              {formData.isShowType === 'Setter' ? (
                <SwitchSetter v-model={formData.isShow} />
              ) : (
                <TextSetter v-model={formData.showCode} onClickText={() => openBindDialog('showCode')} />
              )}
            </div>
          </div>
          <VarAppBar title="唯一渲染标识" color="rgba(31, 56, 88, 0.06)" text-color="#000" v-slots={keySlots} />
          <div class="varlet-low-code-setters-advanced-settings__content">
            <div class="varlet-low-code-setters-advanced-settings__attr">
              {formData.keyType === 'Setter' ? (
                <InputSetter v-model={formData.key} />
              ) : (
                <TextSetter v-model={formData.keyCode} onClickText={() => openBindDialog('keyCode')} />
              )}
            </div>
          </div>
          <VarAppBar title="循环" color="rgba(31, 56, 88, 0.06)" text-color="#000" />
          <div class="varlet-low-code-setters-advanced-settings__content">
            <div class="varlet-low-code-field-body">
              <div class="varlet-low-code-field-body-content">
                <div class="varlet-low-code-field-body-title">循环数据</div>
                <TextSetter v-model={formData.key} />
                <BindTypePopover
                  v-model={formData.isShowType}
                  onSelectVariable={() => openBindDialog('showCode')}
                  class="varlet-low-code-field__body-setter-icon"
                />
              </div>
            </div>
            {/* <div class="attribute-field-body">
              <div class="attribute-field-body-title">循环 Key</div>
              <div class="attribute-field-body-content">
                <InputSetter v-model={formData.key} />
                <BindTypePopover
                  v-model={formData.isShowType}
                  onSelectVariable={() => openBindDialog('showCode')}
                  class="varlet-low-code-field__body-setter-icon"
                />
              </div>
            </div> */}
          </div>
          <BindDialog
            v-model={showDialog.value}
            v-model:code={dialogCode.value}
            onConfirm={saveCode}
            schemaId={props.schemaId}
          />
        </div>
      )
    }
  },
})
