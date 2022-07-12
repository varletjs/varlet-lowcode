import Designer from './Designer.vue'
import { SkeletonLayouts } from '@varlet/lowcode-core'
import type { SkeletonPlugin } from '@varlet/lowcode-core'

export * from './types'

const DesignerPlugin: SkeletonPlugin = {
  name: 'designer',
  component: Designer,
  layout: SkeletonLayouts.DESIGNER,
}

export default DesignerPlugin
