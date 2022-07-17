<script lang="ts" setup name="VarletLowcodeDraggableTree">
import { TreeNode, treeProps } from './props'
import DraggableTreeNode from './DraggableTreeNode.vue'
import { defineProps } from 'vue'
import useTree from './hooks/useTree'
import { eventsManager } from '@varlet/lowcode-core'

const props = defineProps(treeProps)

const onDragOver = (e: DragEvent) => {
  e.dataTransfer!.dropEffect = 'move'
}

const handleTreeUpdate = (newTree: TreeNode[]) => {
  props['onUpdate:tree']?.(newTree)
}

useTree(props.tree)

eventsManager.on('treeUpdate', handleTreeUpdate)
</script>

<template>
  <div @dragover="onDragOver" class="varlet-low-code-draggable-tree">
    <DraggableTreeNode v-for="treeNode of props.tree" :key="treeNode.id" :tree-node="treeNode" />
  </div>
</template>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}

.varlet-low-code-draggable-tree {
  width: 100%;
  margin-left: -20px;
}
</style>
