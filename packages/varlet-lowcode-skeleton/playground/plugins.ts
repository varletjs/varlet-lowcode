import DesignerPlugin from '@varlet/lowcode-designer'
import CodeEditorPlugin from '@varlet/lowcode-code-editor'
import MaterialsPanelPlugin from '@varlet/lowcode-materials-panel'
import SchemaEditorPlugin from '@varlet/lowcode-schema-editor'
import UndoRedoPlugin from '@varlet/lowcode-undo-redo'
import ResizerPlugin from '@varlet/lowcode-resizer'
import CodegenPlugin from '@varlet/lowcode-codegen'
// import SettersPlugin from '@varlet/lowcode-setters'
import SettersPlugin from '../../varlet-lowcode-setters/src/index'
import { pluginsManager, SkeletonLayouts } from '@varlet/lowcode-core'

CodegenPlugin.componentProps = {
  style: {
    marginRight: '30px',
    marginLeft: '4px',
  },
}

export function usePlugins() {
  pluginsManager
    .useSkeletonPlugin(DesignerPlugin)
    .useSkeletonPlugin(SettersPlugin)
    .useSkeletonPlugin(ResizerPlugin)
    .useSkeletonPlugin(MaterialsPanelPlugin)
    .useSkeletonPlugin(CodeEditorPlugin)
    .useSkeletonPlugin(SchemaEditorPlugin)
    .useSkeletonPlugin(UndoRedoPlugin)
    .useSkeletonPlugin(CodegenPlugin)
}
