import { buildCli, buildCore, buildDnd, runTask } from './build.mjs'

await Promise.all([
  runTask('cli', buildCli),
  runTask('core', buildCore),
  runTask('dnd', buildDnd)
])
