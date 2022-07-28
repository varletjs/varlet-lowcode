<script setup lang="ts">
import Monaco from '@varlet/lowcode-monaco'
import { ref, onUnmounted, onMounted, nextTick } from 'vue'
import { BuiltInEvents, eventsManager, schemaManager } from '@varlet/lowcode-core'
import { createParser } from '@varlet/lowcode-parser'
import {
  Snackbar,
  StyleProvider,
  Tabs as VarTabs,
  Tab as VarTab,
  TabsItems as VarTabsItems,
  TabItem as VarTabItem,
} from '@varlet/ui'
import { SkeletonEvents } from '@varlet/lowcode-skeleton'
import '@varlet/ui/es/snackbar/style/index.js'
import '@varlet/ui/es/tabs/style/index.js'
import '@varlet/ui/es/tab/style/index.js'
import '@varlet/ui/es/tabs-items/style/index.js'
import '@varlet/ui/es/tab-item/style/index.js'
import type { Ref } from 'vue'
import type { SchemaPageNode } from '@varlet/lowcode-core'
import type { IRange } from 'monaco-editor'

const VarStyleProvider = StyleProvider.Component

const { traverseFunction, transformCompatibleCode } = createParser()

let schema = schemaManager.exportSchema()

const NOOP_SETUP = 'function setup() {\n  return {\n}\n}'

const code: Ref<string> = ref(schema.code ?? NOOP_SETUP)
const css: Ref<string> = ref(schema.css ?? '')
const active: Ref<string> = ref('js')
const tabs: Ref<any> = ref()
const tabsItems: Ref<any> = ref()

function handleSchemaChange(newSchema: SchemaPageNode, payload?: any) {
  const oldSchema = schema
  schema = newSchema

  if (css.value !== newSchema.css) {
    css.value = newSchema.css ?? ''
  }

  if (code.value !== newSchema.code) {
    code.value = newSchema.code ?? NOOP_SETUP
  }

  if (payload?.emitter === 'undo-redo' || payload?.emitter === 'schema-editor') {
    return
  }

  if (newSchema.code !== oldSchema.code) {
    saveCode()
  }
}

async function handleSkeletonSidebarToggle() {
  await nextTick()

  tabs.value.resize()
  tabsItems.value.swipe.resize()
}

function createApiSuggestions(range: IRange) {
  return [
    'h',
    'renderList',
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

onMounted(() => {
  eventsManager.on(SkeletonEvents.SIDEBAR_TOGGLE, handleSkeletonSidebarToggle)

  saveCode()
})

onUnmounted(() => {
  eventsManager.off(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)
  eventsManager.off(SkeletonEvents.SIDEBAR_TOGGLE, handleSkeletonSidebarToggle)
})
</script>

<template>
  <div class="varlet-low-code-code-editor">
    <var-style-provider :style-vars="{ '--tab-font-size': '12px' }">
      <var-tabs ref="tabs" v-model:active="active">
        <var-tab name="js">JS</var-tab>
        <var-tab name="css">CSS</var-tab>
      </var-tabs>
    </var-style-provider>

    <var-tabs-items
      class="varlet-low-code-code-editor__tabs-items"
      ref="tabsItems"
      :can-swipe="false"
      v-model:active="active"
    >
      <var-tab-item name="js">
        <monaco
          :create-suggestions="createApiSuggestions"
          height="calc(100vh - 160px)"
          v-model:code="code"
          @save="saveCode"
        />
      </var-tab-item>
      <var-tab-item name="css">
        <monaco language="css" height="calc(100vh - 160px)" v-model:code="css" @save="saveCss" />
      </var-tab-item>
    </var-tabs-items>
  </div>
</template>

<style lang="less">
.varlet-low-code-code-editor {
  width: 500px;
}
</style>
