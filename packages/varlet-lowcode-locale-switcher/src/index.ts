import LocaleSwitcher from './LocaleSwitcher.vue'
import { SkeletonLayouts } from '@varlet/lowcode-core'
import type { SkeletonPlugin } from '@varlet/lowcode-core'

const LocaleSwitcherPlugin: SkeletonPlugin = {
  name: 'locale-switcher',
  component: LocaleSwitcher,
  layout: SkeletonLayouts.HEADER_CENTER,
}

export default LocaleSwitcherPlugin
