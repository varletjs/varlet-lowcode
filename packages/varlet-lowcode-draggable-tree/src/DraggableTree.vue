<script lang="ts" setup name="VarletLowcodeDraggableTree">
import { treeProps } from './props'
import DraggableTreeNode from './DraggableTreeNode.vue'
import { defineProps } from 'vue'

const props = defineProps(treeProps)
</script>

<template>
  <div class="varlet-low-code-draggable-tree">
    <template v-for="treeNode of props.tree" :key="treeNode.id">
      <DraggableTreeNode :tree-node="treeNode" />
    </template>
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
