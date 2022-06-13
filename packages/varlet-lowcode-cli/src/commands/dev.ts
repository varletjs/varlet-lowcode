import logger from '../shared/logger'
import chokidar, { FSWatcher } from 'chokidar'
import { createServer, ViteDevServer } from 'vite'
import { pathExistsSync } from 'fs-extra'
import { getVarletLowCodeConfig } from '../config/varletLowcode.config'
import { getDevConfig, getEntry } from '../config/vite.config'
import { merge } from 'lodash'
import { VARLET_LOW_CODE_CONFIG } from '../shared/constant'

let server: ViteDevServer
let watcher: FSWatcher

async function startServer(force: boolean | undefined) {
  const isRestart = Boolean(server)
  logger.info(`${isRestart ? 'Res' : 'S'}tarting server...`)

  // close all instance
  server && (await server.close())
  watcher && (await watcher.close())

  // build all config
  const varletLowCodeConfig = getVarletLowCodeConfig()
  const devConfig = getDevConfig(varletLowCodeConfig)
  const inlineConfig = merge(devConfig, force ? { server: { force: true } } : {})

  server = await createServer(inlineConfig)
  await server.listen()
  server.printUrls()

  if (pathExistsSync(VARLET_LOW_CODE_CONFIG)) {
    watcher = chokidar.watch(VARLET_LOW_CODE_CONFIG)
    watcher.on('change', () => startServer(force))
  }

  logger.success(`\n${isRestart ? 'Res' : 'S'}tart successfully!!!`)
}

export async function dev(cmd: { force?: boolean }) {
  process.env.NODE_ENV = 'development'
  process.env.COMMAND = 'dev'

  if (!getEntry()) {
    logger.warning('Plugin entry not found')
    return
  }

  await startServer(cmd.force)
}
