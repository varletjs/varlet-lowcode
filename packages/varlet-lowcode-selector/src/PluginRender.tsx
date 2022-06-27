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
        <div class="varlet-low-code--selector-plugins">
          {plugins.map((plugin) => {
            const PluginComponent = () => plugin.component as JSX.Element
            return <PluginComponent />
          })}
        </div>
      )
    }
  },
})
