import { defineComponent, computed, ref } from 'vue'
import { Switch, Input } from '@varlet/ui'
import '@varlet/ui/es/switch/style/index.js'
import './index.less'

export default defineComponent({
  name: 'SWITCHINPUTSETTER',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const inputValue = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit('update:modelValue', val)
      },
    })
    const switchValue = ref(true)
    return () => {
      return (
        <div class="varlet-low-code__switch-input">
          <Switch v-model={switchValue.value} />
          <Input v-model={inputValue.value} disabled={!switchValue.value} />
        </div>
      )
    }
  },
})
