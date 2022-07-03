import App from './App.vue'
import { createApp } from 'vue'
import { assetsManager, BuiltInSchemaNodeNames, schemaManager } from '@varlet/lowcode-core'
import '@varlet/touch-emulator'

schemaManager.importSchema({
  id: schemaManager.generateId(),
  name: BuiltInSchemaNodeNames.PAGE,
  code: `\
function setup() {
  const value = ref('')
  const count = ref(1)
  const doubleCount = computed(() => count.value * 2)
  const num = 100
  const item = reactive({ value: 200 })

  const { record } = useDataSources()

  watchEffect(() => {
    console.log(count.value)
  })

  onMounted(() => {
    record.load()
  })

  return {
    value,
    record,
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
            style: schemaManager.createObjectBinding({ marginTop: '20px' }),
            onClick: schemaManager.createExpressionBinding('() => { count.value++; }'),
          },
          slots: {
            default: {
              children: [
                {
                  id: schemaManager.generateId(),
                  name: BuiltInSchemaNodeNames.TEXT,
                  textContent: schemaManager.createExpressionBinding('value.value'),
                },
              ],
            },
          },
        },
        {
          id: schemaManager.generateId(),
          name: 'Input',
          library: 'Varlet',
          props: {
            modelValue: schemaManager.createExpressionBinding('value.value'),
            'onUpdate:modelValue': schemaManager.createExpressionBinding('(_value) => { value.value = _value }'),
          },
          models: ['modelValue'],
        },
      ],
    },
  },

  dataSources: [
    {
      name: 'record',
      url: '/mock.json',
      method: 'get',
      headers: {
        token: 'token!!!',
      },
      timeout: 3000,
      successHandler: schemaManager.createExpressionBinding(
        'function successHandler(response) { Varlet.Snackbar(response.data.data); return response.data.data }'
      ),
      errorHandler: schemaManager.createExpressionBinding('function errorHandler(error) { console.log(error) }'),
    },
  ],
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

createApp(App).mount('#app')
