import { defineComponent, ref } from 'vue'
import { Switch } from '@varlet/ui'
import '@varlet/ui/es/switch/style/index.js'

export default defineComponent({
  name: 'StyleInput',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const switchValue = ref(false)
    switchValue.value = props.modelValue
    const updateModelValue = (val: boolean) => {
      emit('update:modelValue', val)
    }
    return () => {
      return <Switch v-model={switchValue.value} onChange={updateModelValue}></Switch>
    }
  },
})
