import {
  buildCli,
  buildCore,
  buildDataSourcePanel,
  buildDnd,
  buildDesigner,
  buildProfile,
  buildRenderer,
  runTask,
  buildParser,
  buildCodegen,
  buildMonaco,
  buildCodeEditor,
  buildSchemaEditor,
  buildSelector,
  buildUndoRedo,
  buildResizer,
  buildMaterialsPanel,
  buildSkeleton, buildLocaleSwitcher,
  buildSchemaJsxVitePlugin,
  buildSchemaTree
} from './build.mjs'

await runTask('schema jsx vite plugin', buildSchemaJsxVitePlugin)
await runTask('cli', buildCli)
await runTask('core', buildCore)
await runTask('data-source-panel', buildDataSourcePanel)
await runTask('skeleton', buildSkeleton)
await runTask('schema-tree', buildSchemaTree)
await runTask('dnd', buildDnd)
await runTask('selector', buildSelector)
await runTask('renderer', buildRenderer)
await runTask('designer', buildDesigner)
await runTask('parser and monaco', () => Promise.all([buildParser(), buildMonaco()]))
await runTask('plugins and more', () => Promise.all([
  buildCodeEditor(),
  buildSchemaEditor(),
  buildCodegen(),
  buildUndoRedo(),
  buildResizer(),
  buildMaterialsPanel(),
  buildProfile(),
  buildLocaleSwitcher()
]))

