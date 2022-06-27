import App from './App.vue'
import { createApp } from 'vue'
import { assetsManager, BuiltInSchemaNodeNames, schemaManager } from '@varlet/lowcode-core'
import '@varlet/touch-emulator'

schemaManager.importSchema({
  id: schemaManager.generateId(),
  name: BuiltInSchemaNodeNames.PAGE,
  code: `\
function setup() {
  const count = ref(1)
  const doubleCount = computed(() => count.value * 2)
  const num = 100
  const item = reactive({ value: 200 })

  watchEffect(() => {
    console.log(count.value)
  })

  return {
    count,
    doubleCount,
    num,
    item
  }
}
`,
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
                  textContent: schemaManager.createExpressionBinding('doubleCount.value + num + item.value'),
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
  {
    profile: 'VueUseLowcodeProfile',
    resources: ['https://unpkg.com/@vueuse/shared', 'https://unpkg.com/@vueuse/core', './vue-use-lowcode-profile.js'],
  },
])

createApp(App).mount('#app')
