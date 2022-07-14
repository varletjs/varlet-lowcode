import { defineComponent, computed } from 'vue'
import { Switch } from '@varlet/ui'
import '@varlet/ui/es/switch/style/index.js'
import './index.less'

export default defineComponent({
  name: 'SWITCHSETTER',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const switchValue = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit('update:modelValue', val)
      },
    })
    return () => {
      return <Switch v-model={switchValue.value}></Switch>
    }
  },
})
