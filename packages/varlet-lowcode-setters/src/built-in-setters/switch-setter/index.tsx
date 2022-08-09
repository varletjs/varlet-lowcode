import { defineComponent, Ref, ref, watch } from 'vue'
import { Switch } from '@varlet/ui'
import '@varlet/ui/es/switch/style/index.js'
import { eventsManager } from '@varlet/lowcode-core'
import './index.less'

export default defineComponent({
  name: 'SWITCHSETTER',
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
      return <Switch v-model={setter.value.defaultValue}></Switch>
    }
  },
})
