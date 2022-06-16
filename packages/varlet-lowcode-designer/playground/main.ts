import App from './App.vue'
import { createApp } from 'vue'
import { assetsManager, BuiltInSchemaNodeNames, schemaManager } from '@varlet/lowcode-core'

schemaManager.importSchema({
  id: schemaManager.generateId(),
  name: BuiltInSchemaNodeNames.PAGE,
  code: 'function setup() { return { count: 1 } }',
  slots: {
    default: {
      children: [
        {
          id: schemaManager.generateId(),
          name: 'Button',
          library: 'Varlet',
          props: {
            type: 'primary',
          },
          slots: {
            default: {
              children: [
                {
                  id: schemaManager.generateId(),
                  name: BuiltInSchemaNodeNames.TEXT,
                  textContent: schemaManager.createExpressionBinding('count'),
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
    profile: 'VarletLowcodeProfile',
    resources: [
      'https://cdn.jsdelivr.net/npm/@varlet/ui/umd/varlet.js',
      'https://cdn.jsdelivr.net/npm/@varlet/touch-emulator/iife.js',
      './varlet-lowcode-profile.umd.js',
    ],
  },
])

createApp(App).mount('#app')
