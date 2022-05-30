import { pathExistsSync } from 'fs-extra'
import { merge } from 'lodash'
import { VARLET_LOW_CODE_CONFIG } from '../shared/constant'

export function getVarletLowCodeConfig(): Record<string, any> {
  let config: any = {}

  if (pathExistsSync(VARLET_LOW_CODE_CONFIG)) {
    delete require.cache[require.resolve(VARLET_LOW_CODE_CONFIG)]
    config = require(VARLET_LOW_CODE_CONFIG)
  }

  delete require.cache[require.resolve('../../varlet.lowcode.default.config.js')]
  const defaultConfig = require('../../varlet.lowcode.default.config.js')

  const mergedConfig = merge(defaultConfig, config)

  return mergedConfig
}
