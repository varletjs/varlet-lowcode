import type { EventsManager, Assets, PluginsManager, SchemaPageNode } from '@varlet/lowcode-core'
import { PropType } from 'vue'

export default {
  schemaId: {
    type: String,
  },
  designerEventsManager: {
    type: Object as PropType<EventsManager>,
  },
  assets: {
    type: Object as PropType<Assets>,
  },
  pluginsManager: {
    type: Object as PropType<PluginsManager>,
  },
  schema: {
    type: Object as PropType<SchemaPageNode>,
  },
}
