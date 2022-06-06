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

lowCode.schemaManager.importSchema({
  id: uuid(),
  name: BuiltInSchemaNodeNames.PAGE,
  lifeCycles: {
    onBeforeMount: {
      async: false,
      params: [],
      body: 'console.log(1)',
    },
    onMounted: {
      async: false,
      params: [],
      body: 'console.log(2)',
    },
    onBeforeUpdate: {
      async: false,
      params: [],
      body: 'console.log(3)',
    },
    onUpdated: {
      async: false,
      params: [],
      body: 'console.log(4)',
    },
    onBeforeUnmount: {
      async: false,
      params: [],
      body: 'console.log(5)',
    },
    onUnmounted: {
      async: false,
      params: [],
      body: 'console.log(6)',
    },
  },
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
  slots: {
    default: [
      {
        id: uuid(),
        name: BuiltInSchemaNodeNames.TEXT,
        textContent: {
          type: BuiltInSchemaNodeBindingTypes.VARIABLE_BINDING,
          value: 'count',
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
                  type: BuiltInSchemaNodeBindingTypes.FUNCTION_BINDING,
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
                      type: BuiltInSchemaNodeBindingTypes.VARIABLE_BINDING,
                      value: 'count',
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
