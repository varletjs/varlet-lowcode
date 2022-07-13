import Codegen from './Codegen.vue'
import { SkeletonLayouts } from '@varlet/lowcode-core'
import type { SkeletonPlugin } from '@varlet/lowcode-core'

const CodegenPlugin: SkeletonPlugin = {
  name: 'codegen',
  component: Codegen,
  layout: SkeletonLayouts.HEADER_RIGHT,
}

export default CodegenPlugin
