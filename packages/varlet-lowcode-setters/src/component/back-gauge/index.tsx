import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StyleInput',
  props: {
    modelValue: {
      type: Object,
      default: () => {
        return {
          margin: {},
          padding: {},
        }
      },
    },
    positionValue: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    return () => {
      return (
        <div style={{ width: '100%' }}>
          <div>123456</div>
        </div>
      )
    }
  },
})
