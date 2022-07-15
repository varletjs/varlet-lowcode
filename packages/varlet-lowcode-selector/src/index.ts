import VarletLowCodeSelector from './Selector'
import { pluginsManager } from '@varlet/lowcode-core'
import Copy from './selectorPlugins/copy.vue'
import Remove from './selectorPlugins/remove.vue'
import OpenSlots from './selectorPlugins/openSlots.vue'

pluginsManager
  .useSelectorPlugin({
    name: 'copy',
    component: Copy,
  })
  .useSelectorPlugin({
    name: 'remove',
    component: Remove,
  })
  .useSelectorPlugin({
    name: 'openSlots',
    component: OpenSlots,
  })

export default VarletLowCodeSelector
