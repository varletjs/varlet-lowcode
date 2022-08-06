<script lang="ts" setup name="VarletLowcodeDraggableTree">
import { PropType, defineProps, onMounted } from 'vue'
import DraggableTreeNode from './DraggableTreeNode.vue'
import { dndTree } from './provider'

export interface TreeNode {
  id: string
  text?: string
  children?: TreeNode[]
}

const props = defineProps({
  tree: {
    type: Object as PropType<TreeNode>,
    required: true,
    default: () => ({}),
  },
})

// TODO: linstener tree change or the undo-redo EventBus

onMounted(() => {
  dndTree.value = JSON.parse(JSON.stringify(props.tree))
})
</script>

<template>
  <div class="varlet-low-code-draggable-tree">
    <DraggableTreeNode :tree-node="dndTree" />
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
