<script lang="ts" setup name="VarletLowcodeDraggableTree">
import { TreeNode, treeProps } from './props'
import DraggableTreeNode from './DraggableTreeNode.vue'
import { defineProps, ref } from 'vue'
import DragTree from './DragTree'
import { eventsManager } from '@varlet/lowcode-core'
import Dnd from './Dnd'

const props = defineProps(treeProps)

const dragTree = ref(new DragTree(props.tree))
const dnd = ref(new Dnd())

const onDragOver = (e: DragEvent) => {
  e.dataTransfer!.dropEffect = 'move'
}

const handleTreeUpdate = (newTree: TreeNode[]) => {
  props['onUpdate:tree']?.(newTree)

  dragTree.value.setTree(newTree)
}

eventsManager.on('treeUpdate', handleTreeUpdate)
</script>

<template>
  {{ dnd.overNode?.id }}
  <div @dragover="onDragOver" class="varlet-low-code-draggable-tree">
    <DraggableTreeNode
      v-for="treeNode of props.tree"
      :key="treeNode.id"
      :tree-node="treeNode"
      :drag-tree="dragTree"
      :dnd="dnd"
      :z-index="0"
    />
  </div>
</template>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}

.varlet-low-code-draggable-tree {
  width: 100%;
  overflow-x: hidden;
}
</style>
