<script lang="ts" setup name="DraggableTreeNode">
import { TreeNode, treeNodeProps } from './props'
import { ref, defineProps } from 'vue'
import { Icon } from '@varlet/ui'
import '@varlet/ui/es/icon/style/index.js'
import useDnd from './hooks/useDnd'

const props = defineProps(treeNodeProps)
const expand = ref(false)

const { setDragNode, setDropNode, dragNode, dropNode } = useDnd()

const toggleExpand = () => {
  expand.value = !expand.value
}

const onDragStart = (e: DragEvent, treeNode: TreeNode) => {
  e.stopPropagation()
  e.dataTransfer!.effectAllowed = 'move'
  expand.value = false

  props.dragTree?.setFrom(treeNode)

  setDragNode(treeNode)
}

const onDragOver = (e: DragEvent) => {
  e.preventDefault()

  e.dataTransfer!.dropEffect = 'move'
}

const onDragEnter = (e: Event, treeNode: TreeNode) => {
  e.stopPropagation()

  setDropNode(treeNode)

  if (dragNode.value!.id !== dropNode.value!.id) {
    props.dragTree?.toggleTreeNodeChange(dropNode.value as TreeNode)
  }
}

const onDrop = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()

  props.dragTree?.submitTreeNodeChange()

  setDropNode()
  setDragNode()
}
</script>

<template>
  <div
    :class="{
      'varlet-low-code-draggable-tree-node--dragging': dragNode?.id == props.treeNode.id,
      'varlet-low-code-draggable-tree-node__holder': treeNode.id == 'holder',
    }"
    class="varlet-low-code-draggable-tree-node"
    draggable="true"
    @dragstart="onDragStart($event, props.treeNode)"
    @dragenter="onDragEnter($event, props.treeNode)"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <div class="varlet-low-code-draggable-tree-node__title">
      <Icon
        v-if="treeNode.children?.length"
        @click="toggleExpand"
        name="chevron-right"
        :class="expand ? 'varlet-low-code-draggable-tree-node__icon-expand' : ''"
      />
      {{ treeNode.text }}
    </div>
    <div style="padding-left: 20px" v-if="treeNode.children?.length && expand">
      <DraggableTreeNode
        :drag-tree="dragTree"
        v-show="expand"
        :tree-node="treeNode"
        v-for="treeNode of treeNode.children"
        :key="treeNode.id"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.varlet-low-code-draggable-tree-node {
  &__title {
    height: 30px;
  }

  &__icon-expand {
    transform: rotate(90deg);
  }

  &--dragging {
    background: red;
  }

  &__holder {
    border: 1px #3a7afe dashed;
  }
}
</style>
