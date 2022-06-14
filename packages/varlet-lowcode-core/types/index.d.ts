import { SchemaManager } from './modules/schema'
import { AssetsManager } from './modules/assets'
import { EventManager } from './modules/events'
import { PluginsManager } from './modules/plugins'

export declare enum BuiltInEvents {
  SCHEMA_CHANGE = 'schema-change',
  ASSETS_CHANGE = 'assets-change',
}
export declare type LowCode = {
  schemaManager: SchemaManager
  assetsManager: AssetsManager
  eventsManager: EventManager
  pluginsManager: PluginsManager
}
export declare const lowCode: LowCode
export default lowCode
export * from './modules/schema'
export * from './modules/assets'
export * from './modules/events'
