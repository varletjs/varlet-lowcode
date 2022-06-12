import { buildCli, buildCore, buildDnd, buildDesigner, runTask } from './build.mjs'

await runTask('cli', buildCli)
await runTask('core', buildCore)
await runTask('dnd', buildDnd)
await runTask('designer', buildDesigner)
