import { defineComponent, watch, Ref, ref } from 'vue'
import { Input } from '@varlet/ui'
import '@varlet/ui/es/input/style/index.js'
import { eventsManager } from '@varlet/lowcode-core'
import './index.less'

export default defineComponent({
  name: 'INPUTSETTER',
  props: {
    setter: {
      type: Object,
    },
  },
  setup(props) {
    const setter: Ref<any> = ref()
    setter.value = { ...props.setter }
    watch(
      setter.value,
      (newValue) => {
        eventsManager.emit('setter-value-change', newValue)
      },
      { deep: true }
    )

    return () => {
      return <Input v-model={setter.value.defaultValue} />
    }
  },
})
