import type { Ref } from 'vue'
import { CSSProperties, defineComponent, ref } from 'vue'
import { pluginsManager } from '@varlet/lowcode-core'
import { SelectorPlugin } from '@varlet/lowcode-core/src/modules/plugins'

export default defineComponent({
  name: 'VarletLowCodeSelectorPluginRender',
  setup() {

    return () => {
      return <div></div>
    }
  },
})
