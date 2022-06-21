import schemaManager, { SchemaPageNode } from './modules/schema'
import assetsManager, { Assets } from './modules/assets'
import eventsManager from './modules/events'
import pluginsManager from './modules/plugins'

export enum BuiltInEvents {
  SCHEMA_CHANGE = 'schema-change',
  ASSETS_CHANGE = 'assets-change',
}

const originImportSchema = schemaManager.importSchema
const originImportAssets = assetsManager.importAssets

schemaManager.importSchema = function (schemaPageNode: SchemaPageNode) {
  const newSchema = originImportSchema.call(this, schemaPageNode)

  eventsManager.emit(BuiltInEvents.SCHEMA_CHANGE, newSchema)

  return newSchema
}

assetsManager.importAssets = function (assets: Assets) {
  const newAssets = originImportAssets.call(this, assets)

  eventsManager.emit(BuiltInEvents.ASSETS_CHANGE, newAssets)

  return newAssets
}

export { schemaManager, assetsManager, eventsManager, pluginsManager }

export * from './modules/schema'
export * from './modules/assets'
export * from './modules/events'
export * from './modules/plugins'
