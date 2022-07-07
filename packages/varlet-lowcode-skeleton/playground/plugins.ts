import Designer from '@varlet/lowcode-designer'
import CodeEditor from '@varlet/lowcode-code-editor'
import SchemaEditor from '@varlet/lowcode-schema-editor'
import UndoRedo from '@varlet/lowcode-undo-redo'
import Codegen from '@varlet/lowcode-codegen'
import Setters from '../../varlet-lowcode-setters/src/index'
import { pluginsManager, SkeletonLayouts } from '@varlet/lowcode-core'

export function usePlugins() {
  pluginsManager
    .useSkeletonPlugin({
      layout: SkeletonLayouts.DESIGNER,
      component: Designer,
    })
    .useSkeletonPlugin({
      layout: SkeletonLayouts.SETTERS,
      component: Setters,
    })
    .useSkeletonPlugin({
      layout: SkeletonLayouts.HEADER_CENTER,
      component: UndoRedo,
    })
    .useSkeletonPlugin({
      layout: SkeletonLayouts.SIDEBAR_TOP,
      component: CodeEditor,
      icon: 'xml',
      label: '源码面板',
    })
    .useSkeletonPlugin({
      layout: SkeletonLayouts.SIDEBAR_BOTTOM,
      component: SchemaEditor,
      icon: 'code-json',
      label: 'SCHEMA 面板',
    })
    .useSkeletonPlugin({
      layout: SkeletonLayouts.HEADER_RIGHT,
      component: Codegen,
      componentProps: {
        style: {
          marginRight: '18px',
        },
      },
    })
}
