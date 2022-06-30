import { defineComponent, h, VNode } from 'vue'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'

export default defineComponent({
  components: { ColorPicker },
  props: {
    msg: String,
  },
  render() {
    return h('ColorPicker', {}, 123465)
  },
})
