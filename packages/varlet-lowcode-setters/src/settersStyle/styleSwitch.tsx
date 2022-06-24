import type { CSSProperties, Ref } from 'vue'
import { onMounted, onUnmounted, defineComponent, ref, PropType } from 'vue'
import './styleSwitch.less'

interface HTMLElementPlus extends HTMLElement {
  checked?: boolean
}
export default defineComponent({
  name: 'StyleInput',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const updateModelValue = () => {
      emit('update:modelValue', !props.modelValue)
    }
    return () => {
      return (
        <div class="switch" onClick={updateModelValue} data-checked={props.modelValue}>
          <div></div>
        </div>
      )
    }
  },
})
