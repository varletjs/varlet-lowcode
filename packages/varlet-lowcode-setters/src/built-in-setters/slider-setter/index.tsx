import { defineComponent, Ref, ref, watch } from 'vue'
import { Slider as VarSlider } from '@varlet/ui'
import { eventsManager } from '@varlet/lowcode-core'
import '@varlet/ui/es/slider/style/index.js'

export default defineComponent({
  name: 'SLIDERSETTER',
  props: {
    setter: {
      type: Object,
    },
  },
  setup(props, { slots }) {
    const setter: Ref<any> = ref()
    setter.value = { ...props.setter }
    watch(
      setter.value,
      (newValue) => {
        eventsManager.emit('setter-value-change', newValue)
      },
      { deep: true }
    )

    const childrenSlot = {
      button: (props: any) => {
        return slots.default ? slots.default(props.currentValue) : null
      },
    }
    return () => {
      return <VarSlider v-model={setter.value.defaultValue} v-slots={childrenSlot}></VarSlider>
    }
  },
})
