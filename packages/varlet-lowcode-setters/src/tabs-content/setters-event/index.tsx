import { defineComponent, reactive, ref, Ref, watchEffect } from 'vue'
import { AppBar as VarAppBar, CollapseItem as VarCollapseItem, Icon, Collapse as VarCollapse } from '@varlet/ui'
import BindTypePopover from '../../component/bind-type/index'
import BindDialog from '../../component/dialog-setter/index'
import DialogEvent from '../../component/dialog-event/index'

import '@varlet/ui/es/app-bar/style/index.js'
import '@varlet/ui/es/select/style/index.js'
import '@varlet/ui/es/option/style/index.js'
import '@varlet/ui/es/collapse-item/style/index.js'
import '@varlet/ui/es/collapse/style/index.js'
import './index.less'
import accessory from '../../../assets/accessory.png'

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
    const showEventDialog = ref(false)
    const dialogCode: Ref<string> = ref('')
    const dialogEventCode: Ref<string> = ref('')
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

    const saveCode = () => {
      formData[selectContent.value] = dialogCode.value
    }
    const editEvent = () => {
      showEventDialog.value = true
    }
    const selectValue = ref([])
    return () => {
      return (
        <div class="setters-advanced-settings">
          <VarAppBar title="事件设置" color="rgba(31, 56, 88, 0.06)" text-color="#000" v-slots={appBarSlots} />
          <div class="setters-advanced-settings__content">
            <div class="varlet-low-code-field-body varlet-low-code-event__collapse">
              <VarCollapse v-model={selectValue.value}>
                <VarCollapseItem title="点击绑定事件" name="1">
                  <div class="varlet-low-code-variable-bind__select-items" style={{ padding: '5px 0' }}>
                    <div class="disable">onChange</div>
                    <div>rowSelection.onChange</div>
                  </div>
                </VarCollapseItem>
              </VarCollapse>
            </div>
            <div class="varlet-low-code-event__table">
              <div class="varlet-low-code-event__table-row">
                <div>已绑事件</div>
                <div>操作</div>
              </div>
              <div class="varlet-low-code-event__table-row">
                <div>
                  <div>onChange</div>
                  <div style={{ marginLeft: '10px' }}>
                    <Icon name={accessory} size={20} />
                    saveCode
                  </div>
                </div>
                <div>
                  <Icon name="cog-outline" size={24} onClick={editEvent} />
                  <Icon name="delete" size={24} />
                </div>
              </div>
              <div class="varlet-low-code-event__table-row">
                <div>
                  <div>rowSelection.onChange</div>
                  <div style={{ marginLeft: '10px' }}>
                    <Icon name={accessory} size={20} />
                    saveCode
                  </div>
                </div>
                <div>
                  ·
                  <Icon name="cog-outline" size={24} />
                  <Icon name="delete" size={24} />
                </div>
              </div>
            </div>
          </div>
          <BindDialog v-model={showDialog.value} v-model:code={dialogCode.value} onConfirm={saveCode} />
          <DialogEvent v-model={showEventDialog.value} v-model:code={dialogEventCode.value} onConfirm={saveCode} />
        </div>
      )
    }
  },
})
