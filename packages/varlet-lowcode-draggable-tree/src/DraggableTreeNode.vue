<script lang="ts" setup name="DraggableTreeNode">
import { TreeNode, treeNodeProps } from './props'
import { ref, defineProps, Ref } from 'vue'
import { Icon } from '@varlet/ui'
import '@varlet/ui/es/icon/style/index.js'
import useTree from './useTree'

const props = defineProps(treeNodeProps)
const expand = ref(false)

const { toggleTreeNodeChange } = useTree()

const dragNode: Ref<TreeNode | null> = ref(null)
const dropNode: Ref<TreeNode | null> = ref(null)

const toggleExpand = () => {
  expand.value = !expand.value
}

const onDragStart = (e: DragEvent, treeNode: TreeNode) => {
  e.dataTransfer!.effectAllowed = 'move'

  dragNode.value = treeNode
}

const onDragOver = (e: DragEvent) => {
  e.preventDefault()

  e.dataTransfer!.dropEffect = 'move'
}

const onDragEnter = (e: Event, treeNode: TreeNode) => {
  e.stopPropagation()

  dropNode.value = treeNode
}

const onDrop = (e: DragEvent) => {
  e.preventDefault()

  if (dragNode.value!.id !== dropNode.value!.id) {
    toggleTreeNodeChange(dragNode.value as TreeNode, dropNode.value as TreeNode)
  }
}
</script>

<template>
  <div
    class="varlet-low-code-draggable-tree-node"
    draggable="true"
    @dragstart="onDragStart($event, props.treeNode)"
    @dragenter="onDragEnter($event, props.treeNode)"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <div>
      <Icon
        v-if="props.treeNode.children?.length"
        @click="toggleExpand"
        name="chevron-right"
        :class="expand ? 'varlet-low-code-draggable-tree-node__icon-expand' : ''"
      />
      {{ props.treeNode.text }}
    </div>
    <template v-if="props.treeNode.children?.length">
      <DraggableTreeNode
        v-show="expand"
        :tree-node="treeNode"
        v-for="treeNode of props.treeNode.children"
        :key="treeNode.id"
      />
    </template>
  </div>
</template>

<style lang="less" scoped>
.varlet-low-code-draggable-tree-node {
  margin-left: 20px;

  &__icon-expand {
    transform: rotate(90deg);
  }
}
</style>
