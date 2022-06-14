import RendererComponent from './Renderer'
import { createApp, h, ShallowRef, shallowRef } from 'vue'
import { BuiltInSchemaNodeNames, schemaManager } from '@varlet/lowcode-core'
import type { App } from 'vue'
import type { Assets, SchemaPageNode } from '@varlet/lowcode-core'

type Renderer = typeof RendererComponent & {
  app: App
  init(this: Renderer, selector: string): void
  schema: ShallowRef<SchemaPageNode>
  assets: ShallowRef<Assets>
}

const schema = shallowRef<SchemaPageNode>({
  id: schemaManager.generateId(),
  name: BuiltInSchemaNodeNames.PAGE,
})

const assets = shallowRef<Assets>([])

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
  schema,
  assets,
})

export default RendererComponent
