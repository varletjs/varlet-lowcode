import type { CSSProperties, Ref } from 'vue'
import { onMounted, onUnmounted, defineComponent, ref, PropType } from 'vue'
import './styleRadio.less'

interface HTMLElementPlus extends HTMLElement {
  checked?: boolean
}
export default defineComponent({
  name: 'StyleInput',
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: '',
    },
  },
  setup(props, { emit }) {
    const updateModelValue = (val: unknown) => {
      emit('update:modelValue', val)
    }
    return () => {
      return (
        <div class="setters-style-radio-group">
          <label
            class={`setters-style-radio-wrapper ${props.modelValue === 'adaptive' ? 'checked' : null}`}
            onClick={() => updateModelValue('adaptive')}
          >
            <span>自适应</span>
          </label>
          <label
            class={`setters-style-radio-wrapper ${props.modelValue === 'fixed' ? 'checked' : null}`}
            onClick={() => updateModelValue('fixed')}
          >
            <span>固定</span>
          </label>
        </div>
      )
    }
  },
})
