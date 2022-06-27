import { defineComponent, computed } from 'vue'
import { Input } from '@varlet/ui'
import '@varlet/ui/es/input/style/index.js'
import './styleInput.less'

export default defineComponent({
  name: 'StyleInput',
  props: {
    modelValue: String, // 父组件传过来的值
  },
  setup(props, { emit }) {
    const inputValue = computed({
      get: () => props.modelValue,
      set: (val) => {
        console.log(val)
      },
    })
    const updateModelValue = (val: string) => {
      emit('update:modelValue', val)
    }
    return () => {
      return (
        <span class="setters-style-input">
          <Input v-model={inputValue.value} onChange={updateModelValue} />
        </span>
      )
    }
  },
})
