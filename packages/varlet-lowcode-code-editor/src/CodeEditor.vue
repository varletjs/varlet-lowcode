<script setup lang="ts">
import * as monaco from 'monaco-editor'
import './worker'
import { BuiltInEvents, eventsManager, schemaManager } from '@varlet/lowcode-core'
import { ref, Ref, onMounted, onUnmounted } from 'vue'
import type { SchemaPageNode } from '@varlet/lowcode-core'
import type { CancellationToken, editor, IRange , languages, Position } from 'monaco-editor'

let { code } = schemaManager.exportSchema()

const editorContainer: Ref<null | HTMLElement> = ref(null)

let editorInstance: editor.IStandaloneCodeEditor

function handleSchemaChange(schema: SchemaPageNode) {
  ;({ code } = schema)

  if (editorInstance) {
    editorInstance.setValue(code!)
  }
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
      kind: monaco.languages.CompletionItemKind.Keyword,
      documentation: `https://vuejs.org/api/`,
      insertText: `${name}()`,
      range,
      detail: `vue: ${name}`,
    }
  })
}

eventsManager.on(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)

onMounted(() => {
  editorInstance = monaco.editor.create(editorContainer.value!, {
    value:
      code ??
      `\
function setup() {

}`,
    language: 'javascript',
    minimap: {
      enabled: false,
    },
    tabSize: 2,
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
    },
  })

  editorInstance.onDidChangeModelContent(() => {
    console.log(editorInstance.getValue())
  })

  editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    console.log(123)
  })

  editorInstance.addCommand(monaco.KeyMod.WinCtrl | monaco.KeyCode.KeyS, () => {
    console.log(123)
  })

  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems(
      model: editor.ITextModel,
      position: Position,
      context: languages.CompletionContext,
      token: CancellationToken
    ): languages.ProviderResult<languages.CompletionList> {
      const word = model.getWordUntilPosition(position)

      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      return {
        suggestions: createVueApiSuggestions(range),
      }
    },
  })
})

onUnmounted(() => {
  eventsManager.off(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)

  editorInstance!.dispose()
})
</script>

<template>
  <div ref="editorContainer" class="varlet-low-code-code-editor" style="height: 400px"></div>
</template>
