import { defineComponent, ref } from 'vue'
import './setterPosition.less'

export default defineComponent({
  name: 'StyleInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    return () => {
      return (
        <div class="position-box-container">
          <div class="margin-top-div">
            <span class="next-input">
              <input type="text" />
            </span>
          </div>
          <div class="margin-right-div">
            <span class="next-input">
              <input type="text" />
            </span>
          </div>
          <div class="margin-bottom-div">
            <span class="next-input">
              <input type="text" />
            </span>
          </div>
          <div class="margin-left-div">
            <span class="next-input">
              <input type="text" />
            </span>
          </div>
        </div>
      )
    }
  },
})
