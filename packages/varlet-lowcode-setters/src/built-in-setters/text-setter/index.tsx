import { defineComponent } from 'vue'
import './index.less'

export default defineComponent({
  name: 'TEXTSETTER',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'ClickText'],
  setup(props, { emit }) {
    const openBindDialog = () => {
      emit('ClickText')
    }
    return () => {
      return (
        <div onClick={() => openBindDialog()} class="varlet-low-code-setters__text-content">
          已绑定:
          <br />
          {props.modelValue}
        </div>
      )
    }
  },
})
