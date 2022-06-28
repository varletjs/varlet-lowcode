import { defineComponent, ref } from 'vue'
import { Input } from '@varlet/ui'
import '@varlet/ui/es/input/style/index.js'
import './styleInput.less'

export default defineComponent({
  name: 'StyleInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const inputValue = ref('')
    inputValue.value = props.modelValue
    const updateSchema = (val: string) => {
      emit('update:modelValue', val)
    }
    return () => {
      return (
        <span class="setters-style-input">
          <Input v-model={inputValue.value} onChange={updateSchema} />
        </span>
      )
    }
  },
})
