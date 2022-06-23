import type { CSSProperties, Ref } from 'vue'
import { onMounted, onUnmounted, defineComponent, ref, PropType } from 'vue'
import './styleSwitch.less'

export default defineComponent({
  name: 'StyleInput',
  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const updateModelValue = () => {
      emit('update:modelValue', !props.modelValue)
    }
    return () => {
      return (
        <div class="switch" checked={props.modelValue} onClick={updateModelValue}>
          <div></div>
        </div>
      )
    }
  },
})
