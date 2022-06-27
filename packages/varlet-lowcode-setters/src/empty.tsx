import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SettersEmpty',
  setup() {
    return () => {
      return <div class="setters-empty">请在左侧画布选中节点</div>
    }
  },
})
