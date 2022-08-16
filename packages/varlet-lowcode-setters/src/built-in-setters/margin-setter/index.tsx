import { defineComponent, nextTick, reactive } from 'vue'
import './index.less'

export default defineComponent({
  name: 'StyleInput',
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return {}
      },
    },
    positionValue: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    return () => {
      return <div style={{ width: '100%' }}>132465</div>
    }
  },
})
