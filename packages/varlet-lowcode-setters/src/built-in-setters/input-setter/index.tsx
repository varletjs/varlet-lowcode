import { defineComponent, computed } from 'vue'
import { Input } from '@varlet/ui'
import '@varlet/ui/es/input/style/index.js'
import './index.less'

export default defineComponent({
  name: 'INPUTSETTER',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    attr: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  setup(props, { emit }) {
    const inputValue = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit('update:modelValue', val)
      },
    })
    return () => {
      return <Input v-model={inputValue.value} {...props.attr} />
    }
  },
})
