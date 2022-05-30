import schema, { Schema } from './modules/schema'
import assets, { Assets } from './modules/assets'
import events, { Events } from './modules/events'

export type LowCode = Schema & Assets & Events

export const lowCode: LowCode = {
  ...schema,

  ...assets,

  ...events,
}

export default lowCode
