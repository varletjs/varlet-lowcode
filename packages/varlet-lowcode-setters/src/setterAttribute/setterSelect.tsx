import { defineComponent, ref } from 'vue'
import { Select as VarSelect, Option as VarOption } from '@varlet/ui'
import '@varlet/ui/es/select/style/index.js'
import '@varlet/ui/es/option/style/index.js'
import './setterSelect.less'

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
    const selectValue = ref()
    selectValue.value = props.modelValue
    const updateModelValue = (val: any) => {
      emit('update:modelValue', val)
    }
    return () => {
      return (
        <VarSelect v-model={selectValue.value} placeholder="请选择一个选项" onChange={updateModelValue} {...props.attr}>
          {props.options.map((item: any) => {
            return <VarOption label={item.label}>{item.value}</VarOption>
          })}
        </VarSelect>
      )
    }
  },
})
