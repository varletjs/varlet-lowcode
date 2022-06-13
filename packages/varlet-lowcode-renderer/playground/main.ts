import { createApp } from 'vue'
import { v4 as uuid } from 'uuid'
import lowCode, { BuiltInSchemaNodeBindingTypes, BuiltInSchemaNodeNames } from '@varlet/lowcode-core'
import Renderer from '../src/Renderer'

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

  const cardId = uuid()
  const countdownId = uuid()
  const countdown2Id = uuid()

  const schema = {
    id: uuid(),
    name: BuiltInSchemaNodeNames.PAGE,
    functions: ['handleInsert', 'handleConfirm'],
    variables: ['show', 'inputValue', 'todoItems'],
    code,
    slots: {
      default: {
        children: [
          {
            id: uuid(),
            name: 'Dialog.Component',
            props: {
              show: {
                type: BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING,
                value: 'show.value',
              },
              'onUpdate:show': {
                type: BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING,
                value: '() => { show.value = false }',
              },
              onBeforeClose: {
                type: BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING,
                value: 'handleConfirm',
              },
            },
            slots: {
              default: {
                children: [
                  {
                    id: uuid(),
                    name: 'Input',
                    props: {
                      placeholder: '下一步要做什么?',
                      modelValue: {
                        type: BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING,
                        value: 'inputValue.value',
                      },
                      'onUpdate:modelValue': {
                        type: BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING,
                        value: '(value) => { inputValue.value = value }',
                      },
                    },
                  },
                ],
              },
            },
          },
          {
            id: uuid(),
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
                    for: {
                      type: BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING,
                      value: 'todoItems',
                    },
                    props: {
                      ripple: true,
                      description: {
                        type: BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING,
                        value: `$item['${cardId}'].content`,
                      },
                    },
                  },
                  {
                    id: uuid(),
                    name: 'Button',
                    props: {
                      type: 'primary',
                      onClick: {
                        type: BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING,
                        value: 'handleInsert',
                      },
                    },
                    slots: {
                      default: {
                        children: [
                          {
                            id: uuid(),
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
                            id: uuid(),
                            name: BuiltInSchemaNodeNames.TEXT,
                            textContent: {
                              type: BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING,
                              value: `$slotProps['${countdownId}']`,
                            },
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
                                    id: uuid(),
                                    name: BuiltInSchemaNodeNames.TEXT,
                                    textContent: {
                                      type: BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING,
                                      value: `$slotProps['${countdown2Id}']`,
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
          },
        ],
      },
    },
  }

  await lowCode.assetsManager.loadResources(assets, document)

  createApp(Renderer, {
    schema,
    assets,
  }).mount('#app')
})()
