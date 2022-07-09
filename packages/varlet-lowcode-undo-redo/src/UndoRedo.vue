<script setup lang="ts">
import { Button as VarButton, Icon as VarIcon, Space as VarSpace, Snackbar } from '@varlet/ui'
import { schemaManager, eventsManager, BuiltInEvents, SchemaPageNode } from '@varlet/lowcode-core'
import { ref, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import '@varlet/ui/es/button/style/index.js'
import '@varlet/ui/es/icon/style/index.js'

let schema = schemaManager.exportSchema()

const undoStack: Ref<SchemaPageNode[]> = ref([])
const redoStack: Ref<SchemaPageNode[]> = ref([])
let rendererWindow: any

const getRendererWindow = () => Array.from(window).find((w) => w.name === 'rendererWindow') as any

function handleSchemaChange(newSchema: SchemaPageNode, payload?: any) {
  const oldSchema = schema

  schema = newSchema

  if (payload?.emitter === 'undo-redo') {
    return
  }

  if (oldSchema) {
    undoStack.value.push(oldSchema)
    redoStack.value.length = 0
  }
}

function undo() {
  if (undoStack.value.length === 0) {
    Snackbar.warning('不能继续撤回了')
    return
  }

  redoStack.value.push(schema)
  const undoSchema = undoStack.value.pop() as SchemaPageNode

  schemaManager.importSchema(undoSchema, { emitter: 'undo-redo' })
}

function redo() {
  if (redoStack.value.length === 0) {
    Snackbar.warning('不能继续重做了')
    return
  }

  const redoSchema = redoStack.value.pop() as SchemaPageNode
  undoStack.value.push(schema)

  schemaManager.importSchema(redoSchema, { emitter: 'undo-redo' })
}

function handleKeydown(event: KeyboardEvent) {
  const macUndoKey = event.metaKey && !event.shiftKey && event.code === 'KeyZ'
  const winUndoKey = event.ctrlKey && event.code === 'KeyZ'
  const macRedoKey = event.metaKey && event.shiftKey && event.code === 'KeyZ'
  const winRedoKey = event.ctrlKey && event.code === 'KeyY'

  if (macUndoKey || winUndoKey) {
    event.preventDefault()
    undo()
  }

  if (macRedoKey || winRedoKey) {
    event.preventDefault()
    redo()
  }
}

function handleDesignerIframeClick() {
  rendererWindow = getRendererWindow()

  if (!rendererWindow) {
    return
  }

  rendererWindow.addEventListener('keydown', handleKeydown)
}

eventsManager.on(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)
eventsManager.on('designer-iframe-click', handleDesignerIframeClick)
window.addEventListener('keydown', handleKeydown)

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  rendererWindow?.removeEventListener('keydown', handleKeydown)
  eventsManager.off('designer-iframe-click', handleDesignerIframeClick)
  eventsManager.off(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)
})
</script>

<template>
  <div class="varlet-low-code-undo-redo">
    <var-space :size="[0, 16]">
      <var-button type="primary" @click="undo" :disabled="undoStack.length === 0">
        <var-icon name="refresh" class="varlet-low-code-undo-redo__undo-icon" />
      </var-button>
      <var-button type="primary" @click="redo" :disabled="redoStack.length === 0">
        <var-icon name="refresh" />
      </var-button>
    </var-space>
  </div>
</template>

<style lang="less">
.varlet-low-code-undo-redo {
  &__undo-icon {
    transform: rotateY(180deg);
  }
}
</style>
