import Designer from '@varlet/lowcode-designer'
import CodeEditor from '@varlet/lowcode-code-editor'
import SchemaEditor from '@varlet/lowcode-schema-editor'
import Codegen from '@varlet/lowcode-codegen'
import Setters from '../../varlet-lowcode-setters/src/index'
import DataSource from '../../varlet-lowcode-data-source/src/index'
import { pluginsManager, SkeletonLayouts } from '@varlet/lowcode-core'

export function usePlugins() {
  pluginsManager
    .useSkeletonPlugin({
      layout: SkeletonLayouts.DESIGNER,
      name: 'designer',
      component: Designer,
    })
    .useSkeletonPlugin({
      layout: SkeletonLayouts.SETTERS,
      name: 'setters',
      component: Setters,
    })
    .useSkeletonPlugin({
      layout: SkeletonLayouts.SIDEBAR_TOP,
      name: 'code-editor',
      component: CodeEditor,
      icon: 'xml',
      label: '源码面板',
    })
    .useSkeletonPlugin({
      layout: SkeletonLayouts.SIDEBAR_BOTTOM,
      name: 'schema-editor',
      component: SchemaEditor,
      icon: 'code-json',
      label: 'SCHEMA 面板',
    })
    .useSkeletonPlugin({
      layout: SkeletonLayouts.HEADER_RIGHT,
      name: 'codegen',
      component: Codegen,
    })
    .useSkeletonPlugin({
      layout: SkeletonLayouts.SIDEBAR_TOP,
      name: 'data-source',
      component: DataSource,
      icon: 'weather-cloudy',
      label: '数据源',
    })
}
