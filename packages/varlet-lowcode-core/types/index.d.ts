import schemaManager from './modules/schema'
import assetsManager from './modules/assets'
import eventsManager from './modules/events'
import pluginsManager from './modules/plugins'

export declare enum BuiltInEvents {
  SCHEMA_CHANGE = 'schema-change',
  ASSETS_CHANGE = 'assets-change',
}
export { schemaManager, assetsManager, eventsManager, pluginsManager }
export * from './modules/schema'
export * from './modules/assets'
export * from './modules/events'
