import { defineComponent, ref } from 'vue'
import { Slider as VarSlider } from '@varlet/ui'
import '@varlet/ui/es/slider/style/index.js'

export default defineComponent({
  name: 'SLIDERSETTER',
  props: {
    modelValue: {
      type: [Number, Array],
      default: 0,
    },
  },
  setup(props, { emit, slots }) {
    const sliderValue = ref()
    const childrenSlot = {
      button: (props: any) => {
        slots.default ? slots.default(props.currentValue) : null
      },
    }
    sliderValue.value = props.modelValue
    const updateModelValue = (val: any) => {
      emit('update:modelValue', val)
    }
    return () => {
      return <VarSlider v-model={sliderValue.value} onChange={updateModelValue} v-slots={childrenSlot}></VarSlider>
    }
  },
})
