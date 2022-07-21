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
import { SkeletonEvents, SkeletonLoaders } from '@varlet/lowcode-skeleton'
import { DesignerEvents } from './types'

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

  renderer.schema.value = schema

  // TODO: I reported an error after here. I'm not sure if it's renderer.render () or something else.
  if (
    oldSchema?.code !== schema.code ||
    oldSchema?.compatibleCode !== schema.compatibleCode ||
    JSON.stringify(oldSchema.dataSources ?? []) !== JSON.stringify(schema.dataSources ?? [])
  ) {
    renderer.rerender()
    return
  }

  if (schema.css && oldSchema?.css !== schema.css) {
    patchIframeCss(schema.css)
  }
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
  iframeElement.style.width = '100%'
  iframeElement.style.height = '100%'
  iframeElement.frameBorder = 'none'
  container.value!.appendChild(iframeElement)
  iframeElement.contentWindow!.name = 'rendererWindow'
}

async function mountRenderer() {
  eventsManager.emit(SkeletonEvents.LOADING, SkeletonLoaders.FULLSCREEN, 0)

  mountIframe()

  const iframeWindow = iframeElement!.contentWindow as Record<string, any>
  const mergedAssets = [...presetAssets, ...assets]
  await assetsManager.loadResources(mergedAssets, iframeElement!.contentDocument!)

  renderer = iframeWindow.VarletLowcodeRenderer.default

  const app = iframeElement!.contentDocument!.createElement('div')
  app.id = 'app'
  iframeElement!.contentDocument!.body.appendChild(app)
  iframeElement!.contentDocument!.addEventListener('click', (event) => {
    eventsManager.emit(DesignerEvents.IFRAME_CLICK, event)
  })

  renderer.schema.value = schema
  renderer.assets.value = mergedAssets
  renderer.init({ mountRoot: '#app', designerEventsManager: eventsManager })
  renderer.mount()

  // @ts-ignore
  window.eventsManager = eventsManager

  eventsManager.emit(SkeletonEvents.LOADED, SkeletonLoaders.FULLSCREEN, 0)
}

onMounted(async () => {
  await mountRenderer()
})
</script>

<template>
  <div ref="container" class="varlet-low-code-designer"></div>
</template>

<style lang="less">
.varlet-low-code-designer {
  width: 100%;
}
</style>
