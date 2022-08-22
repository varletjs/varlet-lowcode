import Preview from './Preview.vue'
import { SkeletonLayouts } from '@varlet/lowcode-core'
import type { SkeletonPlugin } from '@varlet/lowcode-core'

const PreviewPlugin: SkeletonPlugin = {
  name: 'preview',
  component: Preview,
  layout: SkeletonLayouts.HEADER_RIGHT,
}

export default PreviewPlugin
