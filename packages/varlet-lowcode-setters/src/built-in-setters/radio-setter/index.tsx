import { defineComponent, Ref, ref, watch } from 'vue'
import { Radio as VarRadio, RadioGroup as VarRadioGroup } from '@varlet/ui'
import { eventsManager } from '@varlet/lowcode-core'
import '@varlet/ui/es/radio/style/index.js'
import '@varlet/ui/es/radio-group/style/index.js'

export default defineComponent({
  name: 'SetterRadio',
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
        <VarRadioGroup v-model={setter.value.defaultValue}>
          {props.options.length
            ? props.options.map((item: any) => {
                return <VarRadio checked-value={item.label}>{item.value}</VarRadio>
              })
            : null}
        </VarRadioGroup>
      )
    }
  },
})
