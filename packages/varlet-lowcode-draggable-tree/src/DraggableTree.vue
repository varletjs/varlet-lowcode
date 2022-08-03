<script lang="ts" setup name="VarletLowcodeDraggableTree">
import { treeProps } from './props'
import DraggableTreeNode from './DraggableTreeNode.vue'
import { defineProps, ref, watch } from 'vue'
import DragTree from './DragTree'
import Dnd from './Dnd'

const props = defineProps(treeProps)

const dragTree = ref()

watch(
  () => props.tree,
  (newVal) => {
    dragTree.value = new DragTree(newVal, props['onUpdate:tree'])
  },
  {
    immediate: true,
  }
)

const dnd = ref(new Dnd())

const onDragOver = (e: DragEvent) => {
  e.dataTransfer!.dropEffect = 'move'
}
</script>

<template>
  <div class="varlet-low-code-draggable-tree">
    <DraggableTreeNode
      v-for="treeNode of dragTree.tree"
      :key="treeNode.id"
      :tree-node="treeNode"
      :drag-tree="dragTree"
      :dnd="dnd"
      :indent="0"
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
