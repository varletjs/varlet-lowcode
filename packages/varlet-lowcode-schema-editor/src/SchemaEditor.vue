<script setup lang="ts">
import Monaco from '@varlet/lowcode-monaco'
import { ref, onUnmounted } from 'vue'
import { BuiltInEvents, eventsManager, schemaManager } from '@varlet/lowcode-core'
import { Dialog, Snackbar } from '@varlet/ui'
import '@varlet/ui/es/dialog/style/index.js'
import '@varlet/ui/es/snackbar/style/index.js'
import type { Ref } from 'vue'
import type { SchemaPageNode } from '@varlet/lowcode-core'

const schemaJSON: Ref<string> = ref(toJSON(schemaManager.exportSchema()))

function handleSchemaChange(newSchema: SchemaPageNode) {
  schemaJSON.value = toJSON(newSchema)
}

function toJSON(value: SchemaPageNode) {
  return JSON.stringify(value, null, 2)
}

async function changeSchema() {
  try {
    const newSchema: SchemaPageNode = JSON.parse(schemaJSON.value)

    const action = await Dialog({
      title: '警告!!!',
      message: '错误的修改 schema 可能会让页面崩溃, 是否继续?',
    })

    if (action === 'confirm') {
      schemaManager.importSchema(newSchema, { emitter: 'schema-editor' })
    }
  } catch (e: any) {
    Snackbar.error(e.toString())
  }
}

eventsManager.on(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)

onUnmounted(() => {
  eventsManager.off(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)
})
</script>

<template>
  <monaco language="json" :height="'400px'" v-model:code="schemaJSON" @save="changeSchema" />
</template>
