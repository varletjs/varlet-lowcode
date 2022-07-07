import { Dialog as VarDialog } from '@varlet/ui'
import { defineComponent, Teleport, computed } from 'vue'
import '@varlet/ui/es/dialog/style/index.js'
import './index.less'

export default defineComponent({
  name: 'DIALOGSETTER',
  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
    attr: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  setup(props, { emit }) {
    // const show = ref(true)
    // show.value = props.modelValue
    const show = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit('update:modelValue', val)
      },
    })
    const dialogContent = () => {
      return (
        <div class="varlet-low-code-variable-bind__content">
          <div class="varlet-low-code-variable-bind__left">
            <div class="varlet-low-code-variable-bind__title">变量列表</div>
            <div></div>
          </div>
          <div class="varlet-low-code-variable-bind__right">
            <div class="varlet-low-code-variable-bind__title">绑定</div>
            <div>55551231212315615</div>
          </div>
        </div>
      )
    }
    const childrenSlot = {
      default: () => {
        return dialogContent()
      },
      title: () => {
        return <div>变量绑定</div>
      },
    }
    return () => {
      return (
        <Teleport to="body">
          <VarDialog.Component v-model:show={show.value} v-slots={childrenSlot}></VarDialog.Component>
        </Teleport>
      )
    }
  },
})
