import { SkeletonLayouts, SkeletonPlugin } from '@varlet/lowcode-core'

import SchemaTree from './index.vue'

const SchemaTreePlugin: SkeletonPlugin = {
  name: 'schema-tree',
  component: SchemaTree,
  layout: SkeletonLayouts.SIDEBAR_TOP,
  layoutProps: {
    icon: 'format-list-checkbox',
    label: '大纲树',
  },
}

export default SchemaTreePlugin
