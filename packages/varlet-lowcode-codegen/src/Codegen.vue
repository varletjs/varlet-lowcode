<script setup lang="ts">
import { Button as VarButton } from '@varlet/ui'
import {
  schemaManager,
  eventsManager,
  BuiltInEvents,
  SchemaNodeSlot,
  BuiltInSchemaNodeNames,
} from '@varlet/lowcode-core'
import '@varlet/ui/es/button/style/index.js'
import type { SchemaNode } from '@varlet/lowcode-core'
import { isArray } from './shared'

// let schema = schemaManager.exportSchema()

let schema = schemaManager.exportSchema()

eventsManager.on(BuiltInEvents.SCHEMA_CHANGE, (newSchema) => {
  schema = newSchema
})

const genSlots = (schemaNode: SchemaNode): string => {
  if (!schemaNode.slots) {
    return ''
  }

  if (schemaNode.name === BuiltInSchemaNodeNames.PAGE && isArray(schemaNode.slots.default.children)) {
    return schemaNode.slots.default.children.map(genSlots).join('')
  }

  // return Object.entries(schemaNode.slots).map(([slotName, slot]) => {
  //   if (schemaNode.name === BuiltInSchemaNodeNames.PAGE) {
  //     return
  //   }
  // })

  return ''
}

const codegen = () => {
  return `\
<template>
  <div class="varlet-low-code-page">
    ${genSlots(schema)}
  </div>
</template>
`
}
</script>

<template>
  <div class="varlet-low-code-codegen">
    <var-button type="primary">Codegen</var-button>
  </div>
</template>
