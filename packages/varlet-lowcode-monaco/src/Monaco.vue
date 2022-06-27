<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { ref, Ref, onMounted, onUnmounted, PropType, defineEmits, watch, defineProps } from 'vue'
import type { editor, IRange, languages, Position } from 'monaco-editor'

const props = defineProps({
  code: {
    type: String,
  },
  height: {
    type: String,
  },
  createSuggestions: {
    type: Function as PropType<(range: IRange) => languages.CompletionItem[]>,
    default: () => [],
  },
})

const emit = defineEmits(['save', 'update:code'])

watch(
  () => props.code,
  (newCode) => {
    if (editorInstance) {
      if (editorInstance.getValue() === newCode) {
        return
      }
      editorInstance.setValue(props.code!)
    }
  }
)

let editorInstance: editor.IStandaloneCodeEditor

const editorContainer: Ref<null | HTMLElement> = ref(null)

onMounted(() => {
  editorInstance = monaco.editor.create(editorContainer.value!, {
    value: props.code,
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

  editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    emit('save', editorInstance.getValue())
  })

  editorInstance.addCommand(monaco.KeyMod.WinCtrl | monaco.KeyCode.KeyS, () => {
    emit('save', editorInstance.getValue())
  })

  editorInstance.onDidChangeModelContent(() => {
    emit('update:code', editorInstance.getValue())
  })

  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems(model: editor.ITextModel, position: Position) {
      const word = model.getWordUntilPosition(position)

      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      return {
        suggestions: props.createSuggestions(range),
      }
    },
  })
})

onUnmounted(() => {
  editorInstance!.dispose()
})
</script>

<template>
  <div ref="editorContainer" class="varlet-low-code-code-editor" :style="{ height }"></div>
</template>
