import { defineComponent, computed } from 'vue'
import { Counter as VarCounter } from '@varlet/ui'

import '@varlet/ui/es/input/style/index.js'

export default defineComponent({
  name: 'COUNTERSETTER',
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const counterValue = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit('update:modelValue', val)
      },
    })
    return () => {
      return <VarCounter v-model={counterValue.value} />
    }
  },
})
