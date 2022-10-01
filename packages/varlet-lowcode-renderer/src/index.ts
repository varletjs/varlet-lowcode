import RendererComponent from './Renderer'
import SelectorComponent from '@varlet/lowcode-selector'
import { createApp, h, ShallowRef, shallowRef } from 'vue'
import { BuiltInSchemaNodeNames, schemaManager } from '@varlet/lowcode-core'
import type { App } from 'vue'
import type { Assets, SchemaPageNode, SchemaNode, EventsManager, PluginsManager } from '@varlet/lowcode-core'
import type { DragOverHTMLElement, DropHTMLElement } from '@varlet/lowcode-dnd'

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
            assets: assets.value,
            pluginsManager: this.pluginsManager,
          }),
        ]
      }
    },
  })

  this.designerEventsManager?.on('drop', onDropSchameChange)

  this.app.mount(this.mountRoot)
}

function unmount(this: Renderer) {
  this.designerEventsManager?.off('drop', onDropSchameChange)

  this.app!.unmount()
}

function rerender(this: Renderer) {
  this.unmount()
  this.mount()
}

function onDropSchameChange(dragData: { el: DropHTMLElement; data: SchemaNode }) {
  const rendererDom: DragOverHTMLElement | null = document.querySelector('.varlet-low-code-renderer__designer')

  if (rendererDom) {
    const { _dragover } = rendererDom
    if (_dragover?.nearestInfo) {
      const startSchame = dragData.data
      const targetId = _dragover?.nearestInfo.id

      // TODO: if this action is a move, we should remove Schema By id and append Schema thought id and direction
      // if (startSchame.id) {
      // }

      // TODO: just append Schema thought id and direction
    }
  }
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
