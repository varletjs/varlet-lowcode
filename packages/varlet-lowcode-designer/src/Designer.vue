<script setup lang="ts">
import lowCode, { BuiltInEvents, BuiltInSchemaNodeNames } from '@varlet/lowcode-core'
import { onMounted, ref } from 'vue'
import { v4 as uuid } from 'uuid'

const iframe = ref<HTMLIFrameElement>()

onMounted(async () => {
  const iframeWindow = window[0] as Record<string, any>

  lowCode.eventsManager.on(BuiltInEvents.ASSETS_CHANGE, async (newAssets) => {
    await lowCode.assetsManager.loadResources(newAssets, iframe.value!.contentDocument!)

    const renderer = iframeWindow.VarletLowcodeRenderer.default

    if (!renderer.app) {
      const app = iframe.value!.contentDocument!.createElement('div')
      app.id = 'app'
      iframe.value!.contentDocument!.body.appendChild(app)
      renderer.init('#app')
    } else {
      renderer.app.unmount()
      renderer.app.mount('#app')
    }

    lowCode.eventsManager.on(BuiltInEvents.SCHEMA_CHANGE, (newSchema) => {
      console.log(newSchema)
      iframeWindow.onSchemaChange(newSchema)
    })

    iframeWindow.onAssetsChange(newAssets)

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
    }, 2000)
  })

  lowCode.assetsManager.importAssets([
    {
      resources: [
        'https://cdn.jsdelivr.net/npm/vue',
        './varlet-lowcode-core.iife.js',
        './varlet-lowcode-renderer.iife.js',
      ],
    },
    {
      profile: 'VarletProfile',
      resources: [
        'https://cdn.jsdelivr.net/npm/@varlet/ui/umd/varlet.js',
        'https://cdn.jsdelivr.net/npm/@varlet/touch-emulator/iife.js',
        './varlet-profile.js',
      ],
    },
  ])
})
</script>

<template>
  <div class="varlet-low-code-designer">
    <iframe ref="iframe" frameborder="0" />
  </div>
</template>
