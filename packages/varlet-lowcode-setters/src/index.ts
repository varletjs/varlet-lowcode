import VarletLowCodeSetters from './Setters'
import { SkeletonLayouts } from '@varlet/lowcode-core'
import type { SkeletonPlugin } from '@varlet/lowcode-core'

const SettersPlugin: SkeletonPlugin = {
  name: 'Setters',
  component: VarletLowCodeSetters,
  layout: SkeletonLayouts.SETTERS,
}

export default SettersPlugin
