<script setup lang="ts">
import { BuiltInEvents, schemaManager, assetsManager, eventsManager } from '@varlet/lowcode-core'
import { onMounted, ref } from 'vue'

const presetAssets = [
  {
    resources: [
      'https://cdn.jsdelivr.net/npm/vue',
      // TODO: env config
      './varlet-lowcode-core.umd.js',
      './varlet-lowcode-renderer.umd.js',
    ],
  },
]

let schema = schemaManager.exportSchema()
let assets = assetsManager.exportAssets()

const container = ref<HTMLIFrameElement>()
let renderer: any
let iframeElement: HTMLIFrameElement | null

eventsManager.on(BuiltInEvents.SCHEMA_CHANGE, async (newSchema) => {
  const oldSchema = schema

  schema = newSchema

  if (renderer) {
    if (oldSchema?.code !== schema.code) {
      await mountRenderer()
    } else {
      renderer.schema.value = schema
    }
  }
})

eventsManager.on(BuiltInEvents.ASSETS_CHANGE, async (newAssets) => {
  assets = newAssets

  if (renderer) {
    await mountRenderer()
  }
})

function mountIframe() {
  iframeElement = container.value!.querySelector('iframe')

  if (iframeElement) {
    container.value!.removeChild(iframeElement)
  }

  iframeElement = document.createElement('iframe')
  iframeElement.frameBorder = 'none'
  container.value!.appendChild(iframeElement)
  iframeElement.contentWindow!.name = 'rendererWindow'
}

async function mountRenderer() {
  eventsManager.emit(BuiltInEvents.LOADING)

  mountIframe()

  const iframeWindow = iframeElement!.contentWindow as Record<string, any>
  const mergedAssets = [...presetAssets, ...assets]
  await assetsManager.loadResources(mergedAssets, iframeElement!.contentDocument!)

  renderer = iframeWindow.VarletLowcodeRenderer.default

  const app = iframeElement!.contentDocument!.createElement('div')
  app.id = 'app'
  iframeElement!.contentDocument!.body.appendChild(app)

  renderer.schema.value = schema
  renderer.assets.value = mergedAssets
  renderer.init('#app', eventsManager)

  eventsManager.emit(BuiltInEvents.LOADED)
}

onMounted(async () => {
  await mountRenderer()
})
</script>

<template>
  <div ref="container" class="varlet-low-code-designer">
    <iframe ref="iframe" frameborder="0" />
  </div>
</template>
