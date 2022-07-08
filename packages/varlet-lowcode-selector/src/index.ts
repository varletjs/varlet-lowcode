import VarletLowCodeSelector from './Selector'
import { pluginsManager } from '@varlet/lowcode-core'
import Copy from './selectorPlugins/copy.vue'
import Transh from './selectorPlugins/transh.vue'
import Demo from './selectorPlugins/demo.vue'

pluginsManager
  .useSelectorPlugin({
    name: 'copy',
    component: Copy,
  })
  .useSelectorPlugin({
    name: 'transh',
    component: Transh,
  })
  .useSelectorPlugin({
    name: 'demo',
    component: Demo,
  })

export default VarletLowCodeSelector
