import Resizer from './Resizer.vue'
import { SkeletonLayouts } from '@varlet/lowcode-core'
import type { SkeletonPlugin } from '@varlet/lowcode-core'

const ResizerPlugin: SkeletonPlugin = {
  name: 'resizer',
  component: Resizer,
  layout: SkeletonLayouts.HEADER_CENTER,
}

export default ResizerPlugin
