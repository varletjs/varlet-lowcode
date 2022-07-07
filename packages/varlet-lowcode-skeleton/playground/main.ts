import App from './App.vue'
import { usePlugins } from './plugins'
import { createApp } from 'vue'
import { schemaManager, assetsManager, BuiltInSchemaNodeNames } from '@varlet/lowcode-core'
import '@varlet/touch-emulator'

usePlugins()

schemaManager.importSchema({
  id: schemaManager.generateId(),
  name: BuiltInSchemaNodeNames.PAGE,
  code: `\
function setup() {
  const count = ref(1)
  const doubleCount = computed(() => count.value * 2)

  return {
    count,
    doubleCount,
  }
}
`,
  css: 'body {\n  padding: 20px\n}',
  slots: {
    default: {
      children: [
        {
          id: schemaManager.generateId(),
          name: 'Button',
          library: 'Varlet',
          props: {
            type: 'primary',
            onClick: schemaManager.createExpressionBinding('() => { count.value++; }'),
          },
          slots: {
            default: {
              children: [
                {
                  id: schemaManager.generateId(),
                  name: BuiltInSchemaNodeNames.TEXT,
                  textContent: schemaManager.createExpressionBinding('doubleCount.value'),
                },
              ],
            },
          },
        },
      ],
    },
  },
})

assetsManager.importAssets([
  {
    profileLibrary: 'VarletLowcodeProfile',
    profileResource: './varlet-lowcode-profile.umd.js',
    additionResources: [
      'https://cdn.jsdelivr.net/npm/@varlet/ui/umd/varlet.js',
      'https://cdn.jsdelivr.net/npm/@varlet/touch-emulator/iife.js',
    ],
  },
  {
    additionResources: ['https://cdn.bootcdn.net/ajax/libs/normalize/8.0.1/normalize.css'],
  },
  {
    profileLibrary: 'VueUseLowcodeProfile',
    profileResource: './vue-use-lowcode-profile.js',
    additionResources: ['https://unpkg.com/@vueuse/shared', 'https://unpkg.com/@vueuse/core'],
  },
])

const app = createApp(App)

app.mount('#app')
