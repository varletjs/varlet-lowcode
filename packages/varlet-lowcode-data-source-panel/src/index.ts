import DataSourcePanel from './DataSourcePanel.vue'
import { SkeletonLayouts } from '@varlet/lowcode-core'
import type { SkeletonPlugin } from '@varlet/lowcode-core'

const DataSourcePanelPlugin: SkeletonPlugin = {
  name: 'materials-panel',
  component: DataSourcePanel,
  layout: SkeletonLayouts.SIDEBAR_TOP,
  layoutProps: {
    icon: 'weather-cloudy',
    label: '数据源',
  },
}

export default DataSourcePanelPlugin
