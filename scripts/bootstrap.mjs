import {
  buildCli,
  buildCore,
  buildDnd,
  buildDesigner,
  buildProfile,
  buildRenderer,
  runTask,
  buildAst,
  buildCodegen,
  buildMonaco,
  buildCodeEditor,
  buildSchemaEditor,
  buildSelector,
  buildUndoRedo,
  buildResizer,
  buildMaterialsPanel
} from './build.mjs'

await runTask('cli', buildCli)
await runTask('core', buildCore)
await runTask('dnd', buildDnd)
await runTask('designer', buildDesigner)
await runTask('profile', buildProfile)
await runTask('renderer', buildRenderer)
await runTask('ast', buildAst)
await runTask('codegen', buildCodegen)
await runTask('monaco', buildMonaco)
await runTask('code-editor', buildCodeEditor)
await runTask('schema-editor', buildSchemaEditor)
await runTask('selector', buildSelector)
await runTask('undo-redo', buildUndoRedo)
await runTask('resizer', buildResizer)
await runTask('materials-panel', buildMaterialsPanel)
