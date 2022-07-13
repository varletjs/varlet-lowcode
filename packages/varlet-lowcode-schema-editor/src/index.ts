import SchemaEditor from './SchemaEditor.vue'
import { SkeletonLayouts } from '@varlet/lowcode-core'
import type { SkeletonPlugin } from '@varlet/lowcode-core'

const SchemaEditorPlugin: SkeletonPlugin = {
  name: 'schema-editor',
  component: SchemaEditor,
  layout: SkeletonLayouts.SIDEBAR_BOTTOM,
  layoutProps: {
    icon: 'code-json',
    label: 'SCHEMA 面板',
  },
}

export default SchemaEditorPlugin
