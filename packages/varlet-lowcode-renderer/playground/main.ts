import Renderer from '../src/Renderer'
import { createApp } from 'vue'
import {
  assetsManager,
  schemaManager,
  BuiltInSchemaNodeBindingTypes,
  BuiltInSchemaNodeNames,
} from '@varlet/lowcode-core'

;

(async () => {
  const assets = [
    {
      profile: 'VarletLowcodeProfile',
      resources: [
        'https://cdn.jsdelivr.net/npm/@varlet/ui/umd/varlet.js',
        'https://cdn.jsdelivr.net/npm/@varlet/touch-emulator/iife.js',
        './varlet-lowcode-profile.iife.js',
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
    functions: ['handleInsert', 'handleConfirm'],
    variables: ['show', 'inputValue', 'todoItems'],
    code,
    slots: {
      default: {
        children: [
          {
            id: schemaManager.generateId(),
            name: 'Dialog.Component',
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
                    for: schemaManager.createExpressionBinding('todoItems'),
                    props: {
                      ripple: true,
                      description: schemaManager.createExpressionBinding(`$item['${cardId}'].content`),
                    },
                  },
                  {
                    id: schemaManager.generateId(),
                    name: 'Button',
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
                    id: countdownId,
                    name: 'Countdown',
                    for: 3,
                    props: {
                      time: 99999,
                    },
                    slots: {
                      default: {
                        children: [
                          {
                            id: schemaManager.generateId(),
                            name: BuiltInSchemaNodeNames.TEXT,
                            textContent: schemaManager.createExpressionBinding(`$slotProps['${countdownId}']`),
                          },
                          {
                            id: countdown2Id,
                            name: 'Countdown',
                            for: 3,
                            props: {
                              time: 9999999999,
                            },
                            slots: {
                              default: {
                                children: [
                                  {
                                    id: schemaManager.generateId(),
                                    name: BuiltInSchemaNodeNames.TEXT,
                                    textContent: schemaManager.createExpressionBinding(`$slotProps['${countdown2Id}']`),
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
          },
        ],
      },
    },
  }

  await assetsManager.loadResources(assets, document)

  createApp(Renderer, {
    schema,
    assets,
  }).mount('#app')
})()
