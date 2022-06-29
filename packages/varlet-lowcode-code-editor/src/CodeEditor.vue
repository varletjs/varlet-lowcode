<script setup lang="ts">
import Monaco from '@varlet/lowcode-monaco'
import { ref, Ref, onUnmounted, onMounted } from 'vue'
import { BuiltInEvents, eventsManager, schemaManager } from '@varlet/lowcode-core'
import { createAst } from '@varlet/lowcode-ast'
import { Snackbar } from '@varlet/ui'
import '@varlet/ui/es/snackbar/style/index.js'
import type { SchemaPageNode } from '@varlet/lowcode-core'
import type { IRange } from 'monaco-editor'

const { traverseSetupFunction, transformCompatibleCode } = createAst()

let schema = schemaManager.exportSchema()

const NOOP_SETUP = 'function setup() {\n  return {\n}\n}'

const code: Ref<string> = ref(schema.code ?? NOOP_SETUP)

function handleSchemaChange(newSchema: SchemaPageNode) {
  if (newSchema.code !== code.value) {
    code.value = newSchema.code ?? NOOP_SETUP
    parseCode()
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

function parseCode() {
  try {
    const compatibleCode = transformCompatibleCode(code.value)
    const { returnDeclarations } = traverseSetupFunction(code.value)

    schemaManager.importSchema({
      ...schema,
      setupReturnDeclarations: returnDeclarations,
      code: code.value,
      compatibleCode,
    })
  } catch (e: any) {
    Snackbar.error(e.toString())
  }
}

eventsManager.on(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)

onMounted(parseCode)

onUnmounted(() => {
  eventsManager.off(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)
})
</script>

<template>
  <monaco v-model:code="code" :create-suggestions="createVueApiSuggestions" :height="'400px'" @save="parseCode" />
</template>
