import logger from '../shared/logger'
import { build as buildVite } from 'vite'
import { getLibConfig, getEntry } from '../config/vite.config'
import { getVarletLowCodeConfig } from '../config/varletLowcode.config'

export async function compile() {
  process.env.NODE_ENV = 'production'

  if (!getEntry()) {
    logger.warning('Plugin entry not found')
    return
  }

  const varletLowCodeConfig = getVarletLowCodeConfig()
  const buildConfig = getLibConfig(varletLowCodeConfig)

  await buildVite(buildConfig)
}
