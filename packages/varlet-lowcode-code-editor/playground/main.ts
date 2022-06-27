import App from './App.vue'
import { createApp } from 'vue'
import { BuiltInSchemaNodeNames, pluginsManager, schemaManager, SkeletonLayouts } from '@varlet/lowcode-core'

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

createApp(App).mount('#app')
