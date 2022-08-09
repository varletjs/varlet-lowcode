import { defineComponent, Ref, ref, watch } from 'vue'
import { Select as VarSelect, Option as VarOption } from '@varlet/ui'
import '@varlet/ui/es/select/style/index.js'
import '@varlet/ui/es/option/style/index.js'
import { eventsManager } from '@varlet/lowcode-core'
import './index.less'

export default defineComponent({
  name: 'SetterSetter',
  props: {
    setter: {
      type: Object,
    },
    options: {
      type: Array,
      default: () => {
        return []
      },
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
      return (
        <VarSelect v-model={setter.value.defaultValue}>
          {props.options.map((item: any) => {
            return <VarOption label={item.label}>{item.value}</VarOption>
          })}
        </VarSelect>
      )
    }
  },
})
