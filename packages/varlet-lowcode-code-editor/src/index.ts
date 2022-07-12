import CodeEditor from './CodeEditor.vue'
import { SkeletonLayouts } from '@varlet/lowcode-core'
import type { SkeletonPlugin } from '@varlet/lowcode-core'

const plugin: SkeletonPlugin = {
  layout: SkeletonLayouts.SIDEBAR_TOP,
  name: 'code-editor',
  component: CodeEditor,
  layoutProps: {
    icon: 'xml',
    label: '源码面板',
  },
}

export { CodeEditor }

export default plugin
