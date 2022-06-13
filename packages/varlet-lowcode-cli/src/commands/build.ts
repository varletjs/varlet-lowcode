import logger from '../shared/logger'
import { build as buildVite } from 'vite'
import { getBuildConfig, getEntry } from '../config/vite.config'
import { getVarletLowCodeConfig } from '../config/varletLowcode.config'

export async function build() {
  process.env.NODE_ENV = 'production'
  process.env.COMMAND = 'build'

  if (!getEntry()) {
    logger.warning('Plugin entry not found')
    return
  }

  const varletLowCodeConfig = getVarletLowCodeConfig()
  const buildConfig = getBuildConfig(varletLowCodeConfig)

  await buildVite(buildConfig)
}
