import { eventsManager } from '@varlet/lowcode-core'
import type { CSSProperties, Ref } from 'vue'
import { onMounted, onUnmounted, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SettersEmpty',
  setup() {
    return () => {
      return <div class="setters-empty">请在左侧画布选中节点</div>
    }
  },
})
