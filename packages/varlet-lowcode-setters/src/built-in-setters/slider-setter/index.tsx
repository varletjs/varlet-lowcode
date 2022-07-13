import { defineComponent, computed } from 'vue'
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
    const sliderValue = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit('update:modelValue', val)
      },
    })
    const childrenSlot = {
      button: (props: any) => {
        return slots.default ? slots.default(props.currentValue) : null
      },
    }
    sliderValue.value = props.modelValue
    return () => {
      return <VarSlider v-model={sliderValue.value} v-slots={childrenSlot}></VarSlider>
    }
  },
})
