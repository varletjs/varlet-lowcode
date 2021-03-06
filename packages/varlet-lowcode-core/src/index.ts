import schemaManager from './modules/schema'
import assetsManager, { Assets } from './modules/assets'
import eventsManager from './modules/events'
import pluginsManager from './modules/plugins'
import localeManager from './modules/locale'

export enum BuiltInEvents {
  SCHEMA_CHANGE = 'schema-change',
  ASSETS_CHANGE = 'assets-change',
}

const originImportSchema = schemaManager.importSchema
const originImportAssets = assetsManager.importAssets

schemaManager.importSchema = function (schemaPageNode: any, payload?: any) {
  const newSchema = originImportSchema.call(this, schemaPageNode)

  if (newSchema) {
    eventsManager.emit(BuiltInEvents.SCHEMA_CHANGE, newSchema, payload)
  }

  return newSchema
}

assetsManager.importAssets = function (assets: Assets, payload?: any) {
  const newAssets = originImportAssets.call(this, assets)

  if (newAssets) {
    eventsManager.emit(BuiltInEvents.ASSETS_CHANGE, newAssets, payload)
  }

  return newAssets
}

export { schemaManager, assetsManager, eventsManager, pluginsManager, localeManager }

export * from './modules/schema'
export * from './modules/assets'
export * from './modules/events'
export * from './modules/plugins'
export * from './modules/locale'
