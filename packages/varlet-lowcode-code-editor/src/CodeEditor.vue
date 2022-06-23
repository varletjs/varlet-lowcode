<script setup>
import { BuiltInEvents, eventsManager, schemaManager } from '@varlet/lowcode-core'
import { onUnmounted } from 'vue'

let {code} = schemaManager.exportSchema()

function handleSchemaChange(schema) {
  ;({ code } = schema)
}

eventsManager.on(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)

onUnmounted(() => {
  eventsManager.off(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)
})
</script>

<template>
  <div class="varlet-low-code-code-editor"></div>
</template>
