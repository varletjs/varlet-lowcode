import Renderer from '../src/Renderer'
import { createApp } from 'vue'
import { assetsManager, schemaManager, BuiltInSchemaNodeNames } from '@varlet/lowcode-core'
import type { Assets } from '@varlet/lowcode-core'

;

(async () => {
  const assets: Assets = [
    {
      profileLibrary: 'VarletLowcodeProfile',
      profileResource: './varlet-lowcode-profile.umd.js',
      additionResources: [
        'https://cdn.jsdelivr.net/npm/@varlet/ui/umd/varlet.js',
        'https://cdn.jsdelivr.net/npm/@varlet/touch-emulator/iife.js',
      ],
    },
  ]

  const code = `
  function setup() {
    const cache = localStorage.getItem('todo')
    const show = ref(false)
    const inputValue = ref('')
    const todoItems = reactive(cache ? JSON.parse(cache) : [])

    const handleInsert = () => {
      inputValue.value = ''
      show.value = true
    }

    const handleConfirm = (action, done) => {
      if (action === 'confirm') {
        if (!inputValue.value) {
          Varlet.Snackbar.warning('输入点什么吧???')
          return
        }

        todoItems.push({
          id: Date.now(),
          content: inputValue.value
        })

        localStorage.setItem('todo', JSON.stringify(todoItems))

        Varlet.Snackbar.success('别光写，要做，OK???')

        done()
      }

      done()
    }

    return {
      show,
      inputValue,
      todoItems,
      handleInsert,
      handleConfirm,
    }
  }
`

  const cardId = schemaManager.generateId()
  const countdownId = schemaManager.generateId()
  const countdown2Id = schemaManager.generateId()

  const schema = {
    id: schemaManager.generateId(),
    name: BuiltInSchemaNodeNames.PAGE,
    code,
    slots: {
      default: {
        children: [
          {
            id: schemaManager.generateId(),
            name: 'Dialog.Component',
            library: 'Varlet',
            props: {
              show: schemaManager.createExpressionBinding('show.value'),
              'onUpdate:show': schemaManager.createExpressionBinding('() => { show.value = false }'),
              onBeforeClose: schemaManager.createExpressionBinding('handleConfirm'),
            },
            slots: {
              default: {
                children: [
                  {
                    id: schemaManager.generateId(),
                    name: 'Input',
                    library: 'Varlet',
                    props: {
                      placeholder: '下一步要做什么?',
                      modelValue: schemaManager.createExpressionBinding('inputValue.value'),
                      'onUpdate:modelValue': schemaManager.createExpressionBinding(
                        '(value) => { inputValue.value = value }'
                      ),
                    },
                  },
                ],
              },
            },
          },
          {
            id: schemaManager.generateId(),
            name: 'Space',
            library: 'Varlet',
            props: {
              direction: 'column',
              size: [16, 16],
            },
            slots: {
              default: {
                children: [
                  {
                    id: cardId,
                    name: 'Card',
                    library: 'Varlet',
                    for: schemaManager.createExpressionBinding('todoItems'),
                    key: schemaManager.createExpressionBinding(`$item['${cardId}'].id`),
                    props: {
                      ripple: true,
                      description: schemaManager.createExpressionBinding(`$item['${cardId}'].content`),
                    },
                  },
                  {
                    id: schemaManager.generateId(),
                    name: 'Button',
                    library: 'Varlet',
                    props: {
                      type: 'primary',
                      onClick: schemaManager.createExpressionBinding('handleInsert'),
                    },
                    slots: {
                      default: {
                        children: [
                          {
                            id: schemaManager.generateId(),
                            name: BuiltInSchemaNodeNames.TEXT,
                            textContent: 'Insert',
                          },
                        ],
                      },
                    },
                  },
                  {
                    id: schemaManager.generateId(),
                    name: 'Button',
                    library: 'Varlet',
                    props: {
                      type: 'primary',
                      onClick: schemaManager.createExpressionBinding(`function toggleDisabled() {
    let styles = document.querySelector('#varlet-low-code-events')

    if (styles) {
      document.body.removeChild(styles)
    } else {
      styles = document.createElement('style')
      const styleSheet = \`
      .varlet-low-code--disable-events > * {
        pointer-events: none;
      }

      .varlet-low-code--disable-events {
        pointer-events: all;
      }
      \`

      styles.id = \`varlet-low-code-events\`
      styles.innerHTML = styleSheet

      document.body.appendChild(styles)
    }
  }`),
                    },
                    slots: {
                      default: {
                        children: [
                          {
                            id: schemaManager.generateId(),
                            name: BuiltInSchemaNodeNames.TEXT,
                            textContent: 'Disabled',
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  }

  await assetsManager.loadResources(assets, document)

  const app = createApp(Renderer, {
    schema,
    assets,
  })

  app.mount('#app')

  // test unmount
  Object.assign(window, {
    async unmount() {
      app.unmount()
      assetsManager.unloadResources(assets, document)

      await assetsManager.loadResources(assets, document)

      const schema = {
        id: schemaManager.generateId(),
        name: BuiltInSchemaNodeNames.PAGE,
        slots: {
          default: {
            children: [
              {
                name: 'Button',
                library: 'Varlet',
                props: {
                  type: 'success',
                },
                slots: {
                  default: {
                    children: [
                      {
                        name: BuiltInSchemaNodeNames.TEXT,
                        textContent: 'ok!!!',
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      }

      createApp(Renderer, {
        schema,
        assets,
      }).mount('#app')
    },
  })
})()
