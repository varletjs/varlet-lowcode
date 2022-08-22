import DesignerPlugin from '@varlet/lowcode-designer'
import CodeEditorPlugin from '@varlet/lowcode-code-editor'
import MaterialsPanelPlugin from '@varlet/lowcode-materials-panel'
import SchemaEditorPlugin from '@varlet/lowcode-schema-editor'
import UndoRedoPlugin from '@varlet/lowcode-undo-redo'
import ResizerPlugin from '@varlet/lowcode-resizer'
import CodegenPlugin from '@varlet/lowcode-codegen'
import LocaleSwitcherPlugin from '@varlet/lowcode-locale-switcher'
import SettersPlugin from '@varlet/lowcode-setters/src'
import DataSourcePlugin from '@varlet/lowcode-data-source-panel/src'
import SchemaTreePlugin from '@varlet/lowcode-schema-tree'

// custom plugin
import PreviewPlugin from './preview'

import { pluginsManager } from '@varlet/lowcode-core'

PreviewPlugin.componentProps = {
  style: { marginLeft: '4px' },
}

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
    .useSkeletonPlugin(SchemaTreePlugin)
    .useSkeletonPlugin(LocaleSwitcherPlugin)
    .useSkeletonPlugin(MaterialsPanelPlugin)
    .useSkeletonPlugin(CodeEditorPlugin)
    .useSkeletonPlugin(SchemaEditorPlugin)
    .useSkeletonPlugin(UndoRedoPlugin)
    .useSkeletonPlugin(PreviewPlugin)
    .useSkeletonPlugin(CodegenPlugin)
    .useSkeletonPlugin(DataSourcePlugin)
}
