<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { ref, Ref, onMounted, onUnmounted, PropType, defineEmits, watch, defineProps, defineExpose } from 'vue'
import theme from 'monaco-themes/themes/Chrome DevTools.json'
import type { editor, IRange, languages, Position } from 'monaco-editor'

const props = defineProps({
  code: {
    type: String,
  },
  width: {
    type: String,
  },
  height: {
    type: String,
  },
  language: {
    type: String as PropType<'javascript' | 'json' | 'css'>,
    default: 'javascript',
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
    language: props.language,
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    padding: {
      top: 8,
      bottom: 8,
    },
    tabSize: 2,
    lineHeight: 20,
    scrollbar: {
      verticalScrollbarSize: 6,
      horizontalScrollbarSize: 6,
    },
    fontFamily: 'Consolas,Monaco,monospace',
  })

  monaco.editor.defineTheme('varlet-low-code', theme as any)
  monaco.editor.setTheme('varlet-low-code')

  editorInstance.onDidFocusEditorText(() => {
    editorInstance!.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      emit('save', editorInstance!.getValue())
    })

    editorInstance!.addCommand(monaco.KeyMod.WinCtrl | monaco.KeyCode.KeyS, () => {
      emit('save', editorInstance!.getValue())
    })
  })

  editorInstance.onDidChangeModelContent(() => {
    emit('update:code', editorInstance!.getValue())
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

defineExpose({
  getEditorInstance() {
    return editorInstance
  },
})
</script>

<template>
  <div ref="editorContainer" class="varlet-low-code-monaco" :style="{ width, height }"></div>
</template>
