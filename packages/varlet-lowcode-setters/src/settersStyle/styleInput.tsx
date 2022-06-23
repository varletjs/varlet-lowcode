import type { CSSProperties, Ref } from 'vue'
import { onMounted, onUnmounted, defineComponent, ref, PropType } from 'vue'
import './styleInput.less'

export default defineComponent({
  name: 'StyleInput',
  props: {
    modelValue: String, // 父组件传过来的值
  },
  setup(props, { emit }) {
    console.log(props.modelValue, 'props')
    const updateModelValue = (event: any) => {
      emit('update:modelValue', event.target!.value)
    }
    return () => {
      return (
        <span class="setters-style-input">
          <input type="text" value={props.modelValue} onChange={updateModelValue} />
        </span>
      )
    }
  },
})
