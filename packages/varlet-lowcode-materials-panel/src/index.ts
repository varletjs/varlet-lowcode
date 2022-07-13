import MaterialsPanel from './MaterialsPanel.vue'
import { SkeletonLayouts } from '@varlet/lowcode-core'
import type { SkeletonPlugin } from '@varlet/lowcode-core'

const MaterialsPanelPlugin: SkeletonPlugin = {
  name: 'materials-panel',
  component: MaterialsPanel,
  layout: SkeletonLayouts.SIDEBAR_TOP,
  layoutProps: {
    icon: 'image-outline',
    label: '物料面板',
  },
}

export default MaterialsPanelPlugin
