import CodeEditor from './CodeEditor.vue'
import { SkeletonLayouts } from '@varlet/lowcode-core'
import type { SkeletonPlugin } from '@varlet/lowcode-core'

const plugin: SkeletonPlugin = {
  name: 'code-editor',
  component: CodeEditor,
  layout: SkeletonLayouts.SIDEBAR_TOP,
  layoutProps: {
    icon: 'xml',
    label: '源码面板',
  },
}

export default plugin
