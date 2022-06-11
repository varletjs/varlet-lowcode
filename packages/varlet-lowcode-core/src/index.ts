import schemaManager, { SchemaPageNode, SchemaManager } from './modules/schema'
import assetsManager, { Assets, AssetsManager } from './modules/assets'
import eventsManager, { EventManager } from './modules/events'

export enum BuiltInEvents {
  SCHEMA_CHANGE = 'schema-change',
  ASSETS_CHANGE = 'assets-change',
}

export type LowCode = {
  schemaManager: SchemaManager
  assetsManager: AssetsManager
  eventsManager: EventManager
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

export const lowCode: LowCode = {
  schemaManager,
  assetsManager,
  eventsManager,
}

export default lowCode

export * from './modules/schema'
export * from './modules/assets'
export * from './modules/events'
