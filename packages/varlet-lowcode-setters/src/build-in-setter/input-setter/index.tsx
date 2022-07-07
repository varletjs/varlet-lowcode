import { defineComponent, ref } from 'vue'
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
    const inputValue = ref('')
    inputValue.value = props.modelValue
    const updateSchema = (val: string) => {
      emit('update:modelValue', val)
    }
    return () => {
      return <Input v-model={inputValue.value} onChange={updateSchema} {...props.attr} />
    }
  },
})
