import { defineComponent, computed } from 'vue'
import { Radio as VarRadio, RadioGroup as VarRadioGroup } from '@varlet/ui'
import '@varlet/ui/es/radio/style/index.js'
import '@varlet/ui/es/radio-group/style/index.js'

export default defineComponent({
  name: 'SetterRadio',
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: null,
    },
    options: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  setup(props, { emit }) {
    const radioValue = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit('update:modelValue', val)
      },
    })
    return () => {
      return (
        <VarRadioGroup v-model={radioValue.value}>
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
