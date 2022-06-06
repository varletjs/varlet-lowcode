<script setup lang="ts">
import Renderer from '../src/Renderer'
import lowCode, { BuiltInEvents, BuiltInSchemaNodeNames, BuiltInSchemaNodeBindingTypes } from '@varlet/lowcode-core'
import { ref } from 'vue'
import { v4 as uuid } from 'uuid'
import type { SchemaPageNode } from '@varlet/lowcode-core'

const schema = ref<SchemaPageNode>()

lowCode.eventsManager.on(BuiltInEvents.SCHEMA_CHANGE, (newSchema) => {
  schema.value = newSchema
})

const countdownId = uuid()
const code = `
  function setup() {
    const count = ref(1)
    const doubleCount = computed(() => count.value * 2)
    const handleClick = () => { count.value++ }

    return {
      count,
      doubleCount,
      handleClick
    }
  }
`

lowCode.schemaManager.importSchema({
  id: uuid(),
  name: BuiltInSchemaNodeNames.PAGE,
  functions: {
    handleClick: {
      async: false,
      params: [],
      body: 'count.value++',
    },
  },
  variables: {
    count: 1,
  },
  code,
  slots: {
    default: [
      {
        id: uuid(),
        name: BuiltInSchemaNodeNames.TEXT,
        textContent: {
          type: BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING,
          value: 'doubleCount.value',
        },
      },
      {
        id: uuid(),
        name: 'Space',
        slots: {
          default: [
            {
              id: uuid(),
              name: 'Button',
              props: {
                type: 'primary',
                onClick: {
                  type: BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING,
                  value: 'handleClick',
                },
              },
              slots: {
                default: [
                  {
                    id: uuid(),
                    name: BuiltInSchemaNodeNames.TEXT,
                    textContent: 'Click it: ',
                  },
                  {
                    id: uuid(),
                    name: BuiltInSchemaNodeNames.TEXT,
                    textContent: {
                      type: BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING,
                      value: 'count.value',
                    },
                  },
                ],
              },
            },
            {
              id: countdownId,
              name: 'Countdown',
              props: {
                time: 10000000,
              },
              slots: {
                default: [
                  {
                    id: uuid(),
                    name: 'Button',
                    props: {
                      type: 'warning',
                    },
                    slots: {
                      default: [
                        {
                          id: uuid(),
                          name: BuiltInSchemaNodeNames.TEXT,
                          textContent: {
                            type: BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING,
                            value: `JSON.stringify($slotsParams[\'${countdownId}\'].default[0])`,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
})
</script>

<template>
  <Renderer :schema="schema" />
</template>
