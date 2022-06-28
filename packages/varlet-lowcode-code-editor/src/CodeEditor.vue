<script setup lang="ts">
import Monaco from '@varlet/lowcode-monaco'
import { ref, Ref, onUnmounted, onMounted } from 'vue'
import { BuiltInEvents, eventsManager, schemaManager } from '@varlet/lowcode-core'
import { createAst } from '@varlet/lowcode-ast'
import type { SchemaPageNode } from '@varlet/lowcode-core'
import type { IRange } from 'monaco-editor'

const { traverseSetupFunction } = createAst()

let schema = schemaManager.exportSchema()

const NOOP_SETUP = 'function setup() {\n  return {\n}\n}'

const code: Ref<string> = ref(schema.code ?? NOOP_SETUP)

function handleSchemaChange(newSchema: SchemaPageNode) {
  if (newSchema.code !== code.value) {
    code.value = newSchema.code ?? NOOP_SETUP
    genSetupReturnDeclarations()
  }

  schema = newSchema
}

function createVueApiSuggestions(range: IRange) {
  return [
    'ref',
    'reactive',
    'computed',
    'readonly',
    'watch',
    'watchEffect',
    'watchSyncEffect',
    'watchPostEffect',
    'isRef',
    'unref',
    'toRefs',
    'isProxy',
    'isReactive',
    'isReadonly',
    'onBeforeMount',
    'onMounted',
    'onBeforeUpdate',
    'onUpdated',
    'onBeforeUnmount',
    'onUnmounted',
  ].map((name) => {
    return {
      label: name,
      kind: 17,
      documentation: `https://vuejs.org/api/`,
      insertText: `${name}()`,
      range,
      detail: `vue: ${name}`,
    }
  })
}

function genSetupReturnDeclarations() {
  const { returnDeclarations } = traverseSetupFunction(code.value)

  schemaManager.importSchema({
    ...schema,
    setupReturnDeclarations: returnDeclarations,
    code: code.value,
  })
}

eventsManager.on(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)

onMounted(genSetupReturnDeclarations)

onUnmounted(() => {
  eventsManager.off(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)
})
</script>

<template>
  <monaco
    v-model:code="code"
    :create-suggestions="createVueApiSuggestions"
    :height="'400px'"
    @save="genSetupReturnDeclarations"
  />
</template>
