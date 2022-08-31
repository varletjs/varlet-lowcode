import { defineComponent, Ref, ref, watch } from 'vue'
import { eventsManager } from '@varlet/lowcode-core'
import { Counter as VarCounter } from '@varlet/ui'

import '@varlet/ui/es/counter/style/index.js'

export default defineComponent({
  name: 'COUNTERSETTER',
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
      return <VarCounter v-model={setter.value.defaultValue} />
    }
  },
})
