import { defineComponent, nextTick } from 'vue'
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
  },
  setup(props, { emit }) {
    return () => {
      return <div>132456 132465</div>
    }
  },
})
