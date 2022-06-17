import { defineComponent } from 'vue'
import { pluginsManager } from '@varlet/lowcode-core'

export default defineComponent({
  name: 'VarletLowCodeSelector',
  setup() {
    const plugins = pluginsManager.exportSelectorPlugins()

    return () => {
      return <div>this is a selector</div>
    }
  },
})
