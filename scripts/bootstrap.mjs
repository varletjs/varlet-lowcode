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
  buildSkeleton, buildLocaleSwitcher
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

await runTask('plugins and more', () => Promise.all([
  buildCodeEditor,
  buildSchemaEditor,
  buildCodegen,
  buildUndoRedo,
  buildResizer,
  buildMaterialsPanel,
  buildProfile,
  buildLocaleSwitcher
]))

