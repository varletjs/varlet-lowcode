<script setup lang="ts">
import Renderer from '../src/Renderer'
import type { Assets, SchemaPageNode } from '@varlet/lowcode-core'
import lowCode, { BuiltInEvents, BuiltInSchemaNodeBindingTypes, BuiltInSchemaNodeNames } from '@varlet/lowcode-core'
import { shallowRef } from 'vue'
import { v4 as uuid } from 'uuid'

const schema = shallowRef<SchemaPageNode>()
const assets = shallowRef<Assets>()

lowCode.eventsManager.on(BuiltInEvents.SCHEMA_CHANGE, (newSchema) => {
  schema.value = newSchema
})

lowCode.eventsManager.on(BuiltInEvents.ASSETS_CHANGE, (newAssets) => {
  assets.value = newAssets
})

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

lowCode.schemaManager.importSchema({
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
})

lowCode.assetsManager.importAssets([
  {
    profile: 'VarletProfile',
  },
])
</script>

<template>
  <Renderer :schema="schema" :assets="assets" />
</template>
