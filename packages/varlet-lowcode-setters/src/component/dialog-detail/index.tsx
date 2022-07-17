import { Dialog as VarDialog, Snackbar } from '@varlet/ui'
import { defineComponent, Teleport, computed, ref, Ref, reactive, watchEffect } from 'vue'
import '@varlet/ui/es/dialog/style/index.js'
import '@varlet/ui/es/snackbar/style/index.js'
import './index.less'

export default defineComponent({
  name: 'DIALOGSETTER',
  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue', 'Confirm'],
  setup(props, { emit }) {
    const show = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit('update:modelValue', val)
      },
    })
    const dialogContent = () => {
      return <div class="varlet-low-code-variable-bind__content">321456</div>
    }
    const childrenSlot = {
      default: () => {
        return dialogContent()
      },
      title: () => {
        return <div>变量绑定</div>
      },
    }
    const saveCode = () => {
      console.log(123456)
    }
    return () => {
      return (
        <Teleport to="body">
          <VarDialog.Component
            v-model:show={show.value}
            v-slots={childrenSlot}
            onConfirm={saveCode}
          ></VarDialog.Component>
        </Teleport>
      )
    }
  },
})
