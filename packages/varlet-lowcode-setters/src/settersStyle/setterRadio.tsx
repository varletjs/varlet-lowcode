import { defineComponent, ref } from 'vue'
import { Radio as VarRadio, RadioGroup as VarRadioGroup } from '@varlet/ui'
import '@varlet/ui/es/radio/style/index.js'
import '@varlet/ui/es/radio-group/style/index.js'

export default defineComponent({
  name: 'StyleRadio',
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: '',
    },
  },
  setup() {
    const radioValue = ref('adaptive')
    // const switchValue = computed({
    //   get: () => props.modelValue,
    //   set: val => { }
    // })
    // const updateModelValue = (val: unknown) => {
    //   emit('update:modelValue', val)
    // }
    return () => {
      return (
        <VarRadioGroup v-model={radioValue.value}>
          <VarRadio checked-value="adaptive">自适应</VarRadio>
          <VarRadio checked-value="fixed">固定</VarRadio>
        </VarRadioGroup>
      )
    }
  },
})
