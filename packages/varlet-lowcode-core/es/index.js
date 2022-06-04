import schemaManager from './modules/schema'
import assetsManager from './modules/assets'
import eventsManager from './modules/events'
export var BuiltInEvents
;(function (BuiltInEvents) {
  BuiltInEvents['SCHEMA_CHANGE'] = 'schema-change'
  BuiltInEvents['ASSETS_CHANGE'] = 'assets-change'
})(BuiltInEvents || (BuiltInEvents = {}))
const originImportSchema = schemaManager.importSchema
const originImportAssets = assetsManager.importAssets
schemaManager.importSchema = function (schema) {
  originImportSchema.call(this, schema)
  eventsManager.emit(BuiltInEvents.SCHEMA_CHANGE, schema)
}
assetsManager.importAssets = function (assets) {
  originImportAssets.call(this, assets)
  eventsManager.emit(BuiltInEvents.ASSETS_CHANGE, assets)
}
export const lowCode = {
  schemaManager,
  assetsManager,
  eventsManager,
}
export default lowCode
export * from './modules/schema'
export * from './modules/assets'
export * from './modules/events'
