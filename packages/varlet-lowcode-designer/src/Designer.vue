<script setup lang="ts">
import lowCode, { BuiltInEvents, BuiltInSchemaNodeNames } from '@varlet/lowcode-core'
import { onMounted, ref, shallowRef } from 'vue'
import { v4 as uuid } from 'uuid'

const presetAssets = [
  {
    resources: [
      'https://cdn.jsdelivr.net/npm/vue',
      './varlet-lowcode-core.iife.js',
      './varlet-lowcode-renderer.iife.js',
    ],
  },
]

const schema = shallowRef()
const assets = shallowRef()

const iframe = ref<HTMLIFrameElement>()
let iframeWindow

lowCode.eventsManager.on(BuiltInEvents.SCHEMA_CHANGE, (newSchema) => {
  schema.value = newSchema

  iframeWindow?.onSchemaChange?.(schema.value)
})

lowCode.eventsManager.on(BuiltInEvents.ASSETS_CHANGE, async (newAssets) => {
  assets.value = newAssets

  if (iframeWindow) {
    await loadRenderer()
  }
})

lowCode.schemaManager.importSchema({
  id: uuid(),
  name: BuiltInSchemaNodeNames.PAGE,
  slots: {
    default: {
      children: [
        {
          id: uuid(),
          props: {
            type: 'primary',
          },
          name: 'Button',
          slots: {
            default: {
              children: [
                {
                  id: uuid(),
                  name: BuiltInSchemaNodeNames.TEXT,
                  textContent: 'hello',
                },
              ],
            },
          },
        },
      ],
    },
  },
})

lowCode.assetsManager.importAssets([
  {
    profile: 'VarletProfile',
    resources: [
      'https://cdn.jsdelivr.net/npm/@varlet/ui/umd/varlet.js',
      'https://cdn.jsdelivr.net/npm/@varlet/touch-emulator/iife.js',
      './varlet-profile.js',
    ],
  },
])

async function loadRenderer() {
  const iframeElement = iframe.value!
  iframeElement.contentDocument.documentElement.innerHTML = ''
  iframeWindow = window[0] as Record<string, any>

  const mergedAssets = [...presetAssets, ...assets.value]

  await lowCode.assetsManager.loadResources(mergedAssets, iframeElement.contentDocument!)

  const renderer = iframeWindow.VarletLowcodeRenderer.default
  const app = iframeElement.contentDocument!.createElement('div')
  app.id = 'app'
  iframeElement.contentDocument!.body.appendChild(app)

  renderer.init('#app')

  iframeWindow.onSchemaChange(schema.value)
  iframeWindow.onAssetsChange(mergedAssets)
}

onMounted(async () => {
  await loadRenderer()
  setTimeout(() => {
    lowCode.schemaManager.importSchema({
      id: uuid(),
      name: BuiltInSchemaNodeNames.PAGE,
      slots: {
        default: {
          children: [
            {
              id: uuid(),
              props: {
                type: 'success',
              },
              name: 'Button',
              slots: {
                default: {
                  children: [
                    {
                      id: uuid(),
                      name: BuiltInSchemaNodeNames.TEXT,
                      textContent: 'hello',
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    })
  }, 2000)
})
</script>

<template>
  <div class="varlet-low-code-designer">
    <iframe ref="iframe" frameborder="0" />
  </div>
</template>
