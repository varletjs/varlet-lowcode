import schemaManager, { SchemaManager } from './modules/schema'
import assetsManager, { AssetsManager } from './modules/assets'
import eventsManager, { EventManager } from './modules/events'

export type LowCode = {
  schemaManager: SchemaManager
  assetsManager: AssetsManager
  eventsManager: EventManager
}

export const lowCode: LowCode = {
  schemaManager,
  assetsManager,
  eventsManager,
}

export default lowCode
