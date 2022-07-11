import Designer from '@varlet/lowcode-designer'
import CodeEditor from '@varlet/lowcode-code-editor'
import MaterialsPanel from '@varlet/lowcode-materials-panel'
import SchemaEditor from '@varlet/lowcode-schema-editor'
import UndoRedo from '@varlet/lowcode-undo-redo'
import Resizer from '@varlet/lowcode-resizer'
import Codegen from '@varlet/lowcode-codegen'
import Setters from '../../varlet-lowcode-setters/src/index'
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
      layout: SkeletonLayouts.HEADER_CENTER,
      name: 'resizer',
      component: Resizer,
    })
    .useSkeletonPlugin({
      layout: SkeletonLayouts.SIDEBAR_TOP,
      name: 'materials-panel',
      component: MaterialsPanel,
      layoutProps: {
        icon: 'image-outline',
        label: '物料面板',
      },
    })
    .useSkeletonPlugin({
      layout: SkeletonLayouts.SIDEBAR_TOP,
      name: 'code-editor',
      component: CodeEditor,
      layoutProps: {
        icon: 'xml',
        label: '源码面板',
      },
    })
    .useSkeletonPlugin({
      layout: SkeletonLayouts.SIDEBAR_BOTTOM,
      name: 'schema-editor',
      component: SchemaEditor,
      layoutProps: {
        icon: 'code-json',
        label: 'SCHEMA 面板',
      },
    })
    .useSkeletonPlugin({
      layout: SkeletonLayouts.HEADER_RIGHT,
      name: 'undo-repo',
      component: UndoRedo,
    })
    .useSkeletonPlugin({
      layout: SkeletonLayouts.HEADER_RIGHT,
      name: 'codegen',
      component: Codegen,
      componentProps: {
        style: {
          marginRight: '30px',
          marginLeft: '4px',
        },
      },
    })
}
