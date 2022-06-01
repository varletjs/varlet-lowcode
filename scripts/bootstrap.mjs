import { buildCli, buildCore, runTask } from './build.mjs'

await Promise.all([
  runTask('cli', buildCli),
  runTask('core', buildCore)
])
