import RendererComponent from './Renderer'
import { createApp, h, ShallowRef, shallowRef } from 'vue'
import { BuiltInSchemaNodeNames, schemaManager } from '@varlet/lowcode-core'
import type { App } from 'vue'
import type { Assets, SchemaPageNode, EventsManager } from '@varlet/lowcode-core'

type Renderer = typeof RendererComponent & {
  app?: App
  selector?: string
  designerEventsManager?: EventsManager

  schema: ShallowRef<SchemaPageNode>
  assets: ShallowRef<Assets>

  init(this: Renderer, selector: string, designerEventsManager: EventsManager): void
  mount(this: Renderer): void
  unmount(this: Renderer): void
  rerender(this: Renderer): void
}

const schema = shallowRef<SchemaPageNode>({
  id: schemaManager.generateId(),
  name: BuiltInSchemaNodeNames.PAGE,
})

const assets = shallowRef<Assets>([])

function init(this: Renderer, selector: string, designerEventsManager: EventsManager) {
  this.selector = selector
  this.designerEventsManager = designerEventsManager
}

function mount(this: Renderer) {
  this.app = createApp({
    setup: () => {
      return () => {
        return h(RendererComponent, {
          schema: schema.value,
          assets: assets.value,
          mode: 'designer',
          designerEventsManager: this.designerEventsManager,
        })
      }
    },
  })

  this.app.mount(this.selector)
}

function unmount(this: Renderer) {
  this.app!.unmount()
}

function rerender(this: Renderer) {
  this.unmount()
  this.mount()
}

const Renderer = Object.assign(RendererComponent, {
  app: undefined,
  selector: undefined,
  schema,
  assets,
  init,
  mount,
  unmount,
  rerender,
})

export default Renderer
