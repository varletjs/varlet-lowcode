import RendererComponent from './Renderer'
import { createApp, h, shallowRef } from 'vue'
import { BuiltInSchemaNodeNames } from '@varlet/lowcode-core'
import type { App } from 'vue'
import type { Assets, SchemaPageNode } from '@varlet/lowcode-core'
import { v4 as uuid } from 'uuid'

declare const window: Window & {
  onSchemaChange(schema: SchemaPageNode): void
  onAssetsChange(assets: Assets): void
}

type Renderer = typeof RendererComponent & {
  app: App
  init(this: Renderer, selector: string): void
}

const schema = shallowRef<SchemaPageNode>({
  id: uuid(),
  name: BuiltInSchemaNodeNames.PAGE,
})

const assets = shallowRef<Assets>([])

window.onSchemaChange = (newSchema: SchemaPageNode) => {
  schema.value = newSchema
}

window.onAssetsChange = (newAssets: Assets) => {
  assets.value = newAssets
}

function init(this: Renderer, selector: string) {
  this.app = createApp({
    setup() {
      return () => {
        return h(RendererComponent, {
          schema: schema.value,
          assets: assets.value,
          mode: 'designer',
        })
      }
    },
  })

  this.app.mount(selector)
}

Object.assign(RendererComponent, {
  app: null,
  init,
})

export default RendererComponent
