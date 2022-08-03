import RendererComponent from './Renderer'
import SelectorComponent from '@varlet/lowcode-selector'
import { createApp, h, ShallowRef, shallowRef } from 'vue'
import { BuiltInSchemaNodeNames, schemaManager } from '@varlet/lowcode-core'
import type { App } from 'vue'
import type { Assets, SchemaPageNode, EventsManager, PluginsManager } from '@varlet/lowcode-core'

type InitOptions = {
  mountRoot: string
  designerEventsManager: EventsManager
  pluginsManager: PluginsManager
}

type Renderer = typeof RendererComponent & {
  app?: App
  mountRoot?: string
  designerEventsManager?: EventsManager
  pluginsManager?: PluginsManager

  schema: ShallowRef<SchemaPageNode>
  assets: ShallowRef<Assets>

  init(this: Renderer, options: InitOptions): void
  mount(this: Renderer): void
  unmount(this: Renderer): void
  rerender(this: Renderer): void
}

const schema = shallowRef<SchemaPageNode>({
  id: schemaManager.generateId(),
  name: BuiltInSchemaNodeNames.PAGE,
})

const assets = shallowRef<Assets>([])

function init(this: Renderer, { mountRoot, designerEventsManager, pluginsManager }: InitOptions) {
  this.mountRoot = mountRoot
  this.designerEventsManager = designerEventsManager
  this.pluginsManager = pluginsManager
}

function mount(this: Renderer) {
  this.app = createApp({
    setup: () => {
      return () => {
        return [
          h(RendererComponent, {
            schema: schema.value,
            assets: assets.value,
            mode: 'designer',
            designerEventsManager: this.designerEventsManager,
          }),
          h(SelectorComponent, {
            schema: schema.value,
            designerEventsManager: this.designerEventsManager,
            pluginsManager: this.pluginsManager,
          }),
        ]
      }
    },
  })

  this.app.mount(this.mountRoot)
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
  mountRoot: undefined,
  schema,
  assets,
  init,
  mount,
  unmount,
  rerender,
})

export default Renderer
