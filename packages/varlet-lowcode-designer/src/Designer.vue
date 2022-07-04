<script setup lang="ts">
import {
  BuiltInEvents,
  schemaManager,
  assetsManager,
  eventsManager,
  Assets,
  SchemaPageNode,
} from '@varlet/lowcode-core'
import { onMounted, ref } from 'vue'

const presetAssets: Assets = [
  {
    additionResources: [
      'https://cdn.jsdelivr.net/npm/vue',
      // TODO: env config
      './varlet-lowcode-core.umd.js',
      './varlet-lowcode-renderer.umd.js',
    ],
  },
]

let schema: SchemaPageNode = schemaManager.exportSchema()
let assets: Assets = assetsManager.exportAssets()

const container = ref<HTMLIFrameElement>()
let renderer: any
let iframeElement: HTMLIFrameElement | null

eventsManager.on(BuiltInEvents.SCHEMA_CHANGE, async (newSchema) => {
  const oldSchema = schema

  schema = newSchema

  if (!renderer) {
    return
  }

  if (
    oldSchema?.code !== schema.code ||
    JSON.stringify(oldSchema.dataSources ?? []) !== JSON.stringify(schema.dataSources ?? [])
  ) {
    await mountRenderer()
    return
  }

  if (schema.css && oldSchema?.css !== schema.css) {
    patchIframeCss(schema.css)
  }

  renderer.schema.value = schema
})

eventsManager.on(BuiltInEvents.ASSETS_CHANGE, async (newAssets) => {
  assets = newAssets

  if (renderer) {
    await mountRenderer()
  }
})

function patchIframeCss(css: string) {
  if (!iframeElement) {
    return
  }

  const iframeDocument = iframeElement.contentDocument!

  let style = iframeDocument!.querySelector('#varlet-low-code-css')

  if (!style) {
    style = iframeDocument.createElement('style')
    style.id = 'varlet-low-code-css'
    style.innerHTML = css
    iframeDocument.head.appendChild(style)
    return
  }

  style.innerHTML = css
}

function mountIframe() {
  iframeElement = container.value!.querySelector('iframe')

  if (iframeElement) {
    container.value!.removeChild(iframeElement)
  }

  iframeElement = document.createElement('iframe')
  iframeElement.frameBorder = 'none'
  iframeElement.style.border = '1px solid black'
  iframeElement.style.width = '375px'
  iframeElement.style.height = '667px'
  container.value!.appendChild(iframeElement)
  iframeElement.contentWindow!.name = 'rendererWindow'
}

async function mountRenderer() {
  mountIframe()

  const iframeWindow = iframeElement!.contentWindow as Record<string, any>
  const mergedAssets = [...presetAssets, ...assets]
  await assetsManager.loadResources(mergedAssets, iframeElement!.contentDocument!)

  renderer = iframeWindow.VarletLowcodeRenderer.default

  const app = iframeElement!.contentDocument!.createElement('div')
  app.id = 'app'
  iframeElement!.contentDocument!.body.appendChild(app)
  iframeElement!.contentDocument!.addEventListener('click', (event) => {
    eventsManager.emit('designer-iframe-click', event)
  })

  renderer.mode = 'designer'
  renderer.schema.value = schema
  renderer.assets.value = mergedAssets
  renderer.init('#app', eventsManager)
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
