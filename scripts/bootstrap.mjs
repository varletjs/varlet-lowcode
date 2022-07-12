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
  buildMaterialsPanel,
  buildSkeleton
} from './build.mjs'

await runTask('cli', buildCli)
await runTask('core', buildCore)
await runTask('ast', buildAst)
await runTask('skeleton', buildSkeleton)
await runTask('dnd', buildDnd)
await runTask('selector', buildSelector)
await runTask('renderer', buildRenderer)
await runTask('designer', buildDesigner)
await runTask('monaco', buildMonaco)
await runTask('code-editor', buildCodeEditor)
await runTask('schema-editor', buildSchemaEditor)
await runTask('codegen', buildCodegen)
await runTask('undo-redo', buildUndoRedo)
await runTask('resizer', buildResizer)
await runTask('materials-panel', buildMaterialsPanel)
await runTask('profile', buildProfile)

