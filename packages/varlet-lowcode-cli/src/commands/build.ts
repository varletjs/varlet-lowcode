import logger from '../shared/logger'
import { copy } from 'fs-extra'
import { PLAYGROUND, PLAYGROUND_DIR } from '../shared/constant'
import { build as buildVite } from 'vite'
import { getBuildConfig, getEntry } from '../config/vite.config'
import { getVarletLowCodeConfig } from '../config/varletLowcode.config'

export async function build() {
  process.env.NODE_ENV = 'production'

  if (!getEntry()) {
    logger.warning('Plugin entry not found')
    return
  }

  await copy(PLAYGROUND, PLAYGROUND_DIR)

  const varletLowCodeConfig = getVarletLowCodeConfig()
  const buildConfig = getBuildConfig(varletLowCodeConfig)

  await buildVite(buildConfig)
}
