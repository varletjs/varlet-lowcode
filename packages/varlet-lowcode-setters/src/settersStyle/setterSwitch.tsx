import { defineComponent, computed } from 'vue'
import { Switch } from '@varlet/ui'
import '@varlet/ui/es/switch/style/index.js'

export default defineComponent({
  name: 'StyleInput',
  props: {
    modelValue: Boolean, // 父组件传过来的值
  },
  setup(props, { emit }) {
    const switchValue = computed({
      get: () => props.modelValue,
      set: (val) => {
        console.log(val)
      },
    })
    const updateModelValue = (val: boolean) => {
      emit('update:modelValue', val)
    }
    return () => {
      return <Switch v-model={switchValue.value} onChange={updateModelValue}></Switch>
    }
  },
})
