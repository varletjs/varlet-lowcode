<script setup lang="ts">
import lowCode, { BuiltInEvents, BuiltInSchemaNodeBindingTypes, BuiltInSchemaNodeNames } from '@varlet/lowcode-core'
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

const container = ref<HTMLIFrameElement>()
let iframeWindow
let iframeElement: HTMLIFrameElement

lowCode.eventsManager.on(BuiltInEvents.SCHEMA_CHANGE, (newSchema) => {
  const oldSchema = schema.value

  schema.value = newSchema

  if (iframeWindow) {
    if (oldSchema && oldSchema.code !== schema.value.code) {
      mountRenderer()
    } else {
      iframeWindow.onSchemaChange?.(schema.value)
    }
  }
})

lowCode.eventsManager.on(BuiltInEvents.ASSETS_CHANGE, async (newAssets) => {
  assets.value = newAssets

  if (iframeWindow) {
    await mountRenderer()
  }
})

lowCode.schemaManager.importSchema({
  id: uuid(),
  name: BuiltInSchemaNodeNames.PAGE,
  code: 'function setup() { return { count: 1 } }',
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
                  textContent: {
                    type: BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING,
                    value: 'count',
                  },
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

function mountIframe() {
  iframeElement = container.value!.querySelector('iframe')

  if (iframeElement) {
    container.value!.removeChild(iframeElement)
  }

  iframeElement = document.createElement('iframe')
  iframeElement.frameBorder = 'none'
  container.value!.appendChild(iframeElement)
}

async function mountRenderer() {
  mountIframe()

  iframeWindow = iframeElement.contentWindow as Record<string, any>

  const mergedAssets = [...presetAssets, ...assets.value]

  await lowCode.assetsManager.loadResources(mergedAssets, iframeElement.contentDocument!)

  const renderer = iframeWindow.VarletLowcodeRenderer.default
  const app = iframeElement.contentDocument!.createElement('div')
  app.id = 'app'
  iframeElement.contentDocument!.body.appendChild(app)

  iframeWindow.onSchemaChange(schema.value)
  iframeWindow.onAssetsChange(mergedAssets)

  renderer.init('#app')
}

onMounted(async () => {
  await mountRenderer()
  setTimeout(() => {
    lowCode.schemaManager.importSchema({
      id: uuid(),
      name: BuiltInSchemaNodeNames.PAGE,
      code: 'function setup() { return { count: 2 } }',
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
                      textContent: {
                        type: BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING,
                        value: 'count',
                      },
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
  <div ref="container" class="varlet-low-code-designer">
    <iframe ref="iframe" frameborder="0" />
  </div>
</template>
