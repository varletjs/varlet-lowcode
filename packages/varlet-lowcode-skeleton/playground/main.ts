import schema from './mock.schema'
import App from './App.vue'
import { usePlugins } from './plugins'
import { createApp } from 'vue'
import { schemaManager, assetsManager } from '@varlet/lowcode-core'
import '@varlet/touch-emulator'

usePlugins()

schemaManager.importSchema(schema)
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
  {
    profileLibrary: 'NaiveLowcodeProfile',
    profileResource: './naive-lowcode-profile.js',
    additionResources: ['https://unpkg.com/naive-ui'],
  },
])

const app = createApp(App)

app.mount('#app')
