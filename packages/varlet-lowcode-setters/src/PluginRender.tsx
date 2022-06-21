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
        <div class="varlet-lowcode-selector_plugins">
          {plugins.map((SelectorPlugin) => {
            return <SelectorPlugin.component />
          })}
        </div>
      )
    }
  },
})
