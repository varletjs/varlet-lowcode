<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRaw } from 'vue'
import type { Ref } from 'vue'
import { v4 as uuid } from 'uuid'
import vDragOver from '../src/DragOver'
import vDrag from '../src/Drag'
import type { DragOptions, DropOptions } from '../src'
import vDrop from '../src/Drop'
import { eventsManager } from '@varlet/lowcode-core'

const dragList: DragOptions[] = []
for (let i = 0; i < 10; i++) {
  dragList.push({
    dragStyle: {
      background: '#16a085',
    },
    type: 'move',
    dragData: {
      id: uuid(),
      name: 'Drag Item ' + i,
    },
  })
}

const dropProps: DropOptions = {
  dropStyle: {
    background: '#f1c40f',
  },
  type: 'move',
}

const slotsDropProps: DropOptions = {
  dropStyle: {
    background: '#f1c40f',
  },
  type: 'move',
}

const renderList = reactive<DragOptions[]>([])

const dragSchema: Ref<DragOptions | undefined> = ref<DragOptions>()
const dropSchema: Ref<DragOptions | undefined> = ref<DragOptions>()

const onDragStart = (args: any) => {
  dragSchema.value = args.dragOptions
}

const onDragEnter = (args: any) => {
  dropSchema.value = args.dragOptions
}

const onDrop = () => {
  const dragOptions = toRaw(dragSchema.value)
  const dropOptions = toRaw(dropSchema.value)

  const dragIndex = renderList.findIndex((item) => item.dragData.id === dragOptions?.dragData.id)
  const dropIndex = renderList.findIndex((item) => item.dragData.id === dropOptions?.dragData.id)

  if (dragOptions?.id) {
    renderList.splice(dragIndex, 1)
    dragOptions && renderList.splice(dropIndex, 0, dragOptions)
  } else {
    dragSchema.value && ((dragSchema.value.id = uuid()), (dragSchema.value.dragData.id = uuid()))
    dragOptions && (dropOptions ? renderList.splice(dropIndex, 0, dragOptions) : renderList.push(dragOptions))
  }

  dragSchema.value = undefined
  dropSchema.value = undefined
}

onMounted(() => {
  eventsManager.on('drag-start', onDragStart)
  eventsManager.on('drag-enter', onDragEnter)
  eventsManager.on('drop', onDrop)
})

onUnmounted(() => {
  eventsManager.off('drag-start', onDragStart)
  eventsManager.off('drag-enter', onDragEnter)
  eventsManager.off('drop', onDrop)
})
</script>

<template>
  <div v-drag-over="">
    <div class="drag-list">
      <button class="drag-item" v-for="(item, index) in dragList" :key="item.dragData.id" :id="item.dragData.id"
        v-drag="item">
        drag me {{ index }}
      </button>
    </div>
    <!-- <iframe width="500" src="./demo.html" /> -->
    <!-- <transition-group v-drop="dropProps" name="drag" tag="div" class="drop-place">
      <button v-drop="slotsDropProps" v-drag="item" class="drop-item" v-for="item in renderList" :key="item.id">
        {{ item.dragData?.name }}
      </button>
    </transition-group> -->
  </div>
</template>

<style scoped>
.drag-move {
  transition: transform 0.5s;
}

.drag-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}

.drag-item {
  width: 100px;
  padding: 10px 0;
  text-align: center;
  border-radius: 20px;
  color: #fff;
  background-color: #eb4d4b;
  transition: 0.3s all ease;
}

.drop-item {
  width: 100px;
  padding: 10px 0;
  text-align: center;
  border-radius: 20px;
  color: #fff;
  background-color: #eb4d4b;
  transition: 0.3s all ease;
}

.drop-place {
  height: 500px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 20px;
  margin: 20px;
}
</style>
