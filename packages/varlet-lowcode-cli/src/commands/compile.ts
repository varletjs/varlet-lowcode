import logger from '../shared/logger'
import chokidar from 'chokidar'
import execa from 'execa'
import { build as buildVite } from 'vite'
import { getLibConfig, getEntry } from '../config/vite.config'
import { getVarletLowCodeConfig } from '../config/varletLowcode.config'
import { VARLET_LOW_CODE_CONFIG, PLUGIN_WORKSPACE } from '../shared/constant'

async function runTask() {
  if (!getEntry()) {
    logger.warning('Plugin entry not found')
    return
  }

  const varletLowCodeConfig = getVarletLowCodeConfig()
  const buildConfig = getLibConfig(varletLowCodeConfig)

  await execa('vue-tsc', ['--declaration', '--emitDeclarationOnly'])
  await buildVite(buildConfig)
}

export async function compile({ watch = false }: { watch: boolean }) {
  process.env.NODE_ENV = 'production'

  await runTask()

  if (watch) {
    const watcher = chokidar.watch([VARLET_LOW_CODE_CONFIG, PLUGIN_WORKSPACE], { ignoreInitial: true })
    watcher.on('all', runTask)
  }
}
