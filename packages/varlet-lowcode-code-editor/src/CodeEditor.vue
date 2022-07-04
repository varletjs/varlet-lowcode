<script setup lang="ts">
import Monaco from '@varlet/lowcode-monaco'
import { ref, Ref, onUnmounted, onMounted } from 'vue'
import { BuiltInEvents, eventsManager, schemaManager } from '@varlet/lowcode-core'
import { createAst } from '@varlet/lowcode-ast'
import { Snackbar, Tabs as VarTabs, Tab as VarTab, TabsItems as VarTabsItems, TabItem as VarTabItem } from '@varlet/ui'
import '@varlet/ui/es/snackbar/style/index.js'
import '@varlet/ui/es/tabs/style/index.js'
import '@varlet/ui/es/tab/style/index.js'
import '@varlet/ui/es/tabs-items/style/index.js'
import '@varlet/ui/es/tab-item/style/index.js'
import type { SchemaPageNode } from '@varlet/lowcode-core'
import type { IRange } from 'monaco-editor'

const { traverseFunction, transformCompatibleCode } = createAst()

let schema = schemaManager.exportSchema()

const NOOP_SETUP = 'function setup() {\n  return {\n}\n}'

const code: Ref<string> = ref(schema.code ?? NOOP_SETUP)
const css: Ref<string> = ref(schema.css ?? '')
const active: Ref<string> = ref('js')

function handleSchemaChange(newSchema: SchemaPageNode, payload?: any) {
  schema = newSchema

  if (css.value !== newSchema.css) {
    css.value = newSchema.css ?? ''
  }

  if (payload?.emitter === 'schema-editor') {
    return
  }

  if (code.value !== newSchema.code) {
    code.value = newSchema.code ?? NOOP_SETUP
    saveCode()
  }
}

function createApiSuggestions(range: IRange) {
  return [
    'h',
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
    'useDataSources',
  ].map((name) => {
    return {
      label: name,
      kind: 17,
      documentation: `https://github.com/varletjs/varlet-lowcode`,
      insertText: `${name}()`,
      range,
      detail: `vue: ${name}`,
    }
  })
}

function saveCode() {
  try {
    const compatibleCode = transformCompatibleCode(code.value)
    const { returnDeclarations } = traverseFunction(code.value)

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

function saveCss() {
  schemaManager.importSchema({
    ...schema,
    css: css.value,
  })
}

eventsManager.on(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)

onMounted(saveCode)

onUnmounted(() => {
  eventsManager.off(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)
})
</script>

<template>
  <var-tabs class="varlet-low-code-code-editor__tabs" v-model:active="active">
    <var-tab name="js">JS</var-tab>
    <var-tab name="css">CSS</var-tab>
  </var-tabs>

  <var-tabs-items class="varlet-low-code-code-editor__tabs-items" :can-swipe="false" v-model:active="active">
    <var-tab-item name="js">
      <monaco v-model:code="code" :create-suggestions="createApiSuggestions" height="400px" @save="saveCode" />
    </var-tab-item>
    <var-tab-item name="css">
      <monaco v-model:code="css" language="css" height="400px" @save="saveCss" />
    </var-tab-item>
  </var-tabs-items>
</template>

<style lang="less">
.varlet-low-code-code-editor {
  &__tabs {
    width: 180px;
  }

  &__tabs-items {
    width: 600px;
    margin-top: 16px;
  }
}
</style>
