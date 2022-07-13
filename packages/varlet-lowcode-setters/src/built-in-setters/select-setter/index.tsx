import { defineComponent, computed } from 'vue'
import { Select as VarSelect, Option as VarOption } from '@varlet/ui'
import '@varlet/ui/es/select/style/index.js'
import '@varlet/ui/es/option/style/index.js'
import './index.less'

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
    attr: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  setup(props, { emit }) {
    const selectValue = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit('update:modelValue', val)
      },
    })
    return () => {
      return (
        <VarSelect v-model={selectValue.value} placeholder="请选择一个选项" {...props.attr}>
          {props.options.map((item: any) => {
            return <VarOption label={item.label}>{item.value}</VarOption>
          })}
        </VarSelect>
      )
    }
  },
})
