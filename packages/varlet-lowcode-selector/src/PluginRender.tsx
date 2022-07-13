import type { DefineComponent } from 'vue'
import { defineComponent } from 'vue'
import { pluginsManager } from '@varlet/lowcode-core'
import { SelectorPlugin } from '@varlet/lowcode-core/src/modules/plugins'
import './plugin.less'

export default defineComponent({
  name: 'VarletLowCodeSelectorPluginRender',
  setup() {
    const plugins: SelectorPlugin[] = pluginsManager.exportSelectorPlugins()

    return () => {
      return (
        <div class="varlet-low-code-selector__plugins">
          {plugins.map(({ component }) => {
            const PluginComponent = component as DefineComponent
            return <PluginComponent />
          })}
        </div>
      )
    }
  },
})
