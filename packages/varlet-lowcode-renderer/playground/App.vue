<script setup lang="ts">
import Renderer from '../src/Renderer'
import type { SchemaPageNode } from '@varlet/lowcode-core'
import type { Ref } from 'vue'
import { BuiltInSchemaNodeNames } from '@varlet/lowcode-core'
import { ref } from 'vue'
import { v4 as uuid } from 'uuid'

const schema: Ref<SchemaPageNode> = ref({
  id: uuid(),
  name: BuiltInSchemaNodeNames.PAGE,
  children: [
    {
      id: uuid(),
      name: 'Space',
      children: [
        {
          id: uuid(),
          name: 'Button',
          props: {
            type: 'primary',
          },
          children: [
            {
              id: uuid(),
              name: BuiltInSchemaNodeNames.TEXT,
              textContent: 'Hello',
            },
          ],
        },
        {
          id: uuid(),
          name: 'Button',
          props: {
            type: 'warning',
          },
          children: [
            {
              id: uuid(),
              name: BuiltInSchemaNodeNames.TEXT,
              textContent: 'Hello',
            },
          ],
        },
      ],
    },
  ],
})
</script>

<template>
  <Renderer :schema="schema" />
</template>
