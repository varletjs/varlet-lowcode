import type { DefineComponent } from 'vue'
import { defineComponent } from 'vue'
import type { SelectorPlugin } from '@varlet/lowcode-core'
import Copy from './selectorPlugins/copy.vue'
import Remove from './selectorPlugins/remove.vue'
import OpenSlots from './selectorPlugins/openSlots.vue'
import props from './props'
import './plugin.less'

const builtInPlugins: SelectorPlugin[] = [
  {
    name: 'copy',
    component: Copy,
  },
  {
    name: 'remove',
    component: Remove,
  },
  {
    name: 'openSlots',
    component: OpenSlots,
  },
]

export default defineComponent({
  name: 'VarletLowCodeSelectorPluginRender',
  props,
  setup(props) {
    const plugins: SelectorPlugin[] = props.pluginsManager?.exportSelectorPlugins() ?? []

    plugins.unshift(...builtInPlugins)

    return () => {
      return (
        <div class="varlet-low-code-selector__plugins">
          {plugins.map((plugin: SelectorPlugin) => {
            const PluginComponent = plugin.component as DefineComponent
            return <PluginComponent {...props} />
          })}
        </div>
      )
    }
  },
})
