<script lang="ts" setup name="DraggableTreeNode">
import { TreeNode, treeNodeProps } from './props'
import { ref, defineProps } from 'vue'
import { Icon } from '@varlet/ui'
import '@varlet/ui/es/icon/style/index.js'

const props = defineProps(treeNodeProps)
const expand = ref(false)

const canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas')

const toggleExpand = () => {
  expand.value = !expand.value
}

const onDragStart = (e: DragEvent, treeNode: TreeNode) => {
  e.stopPropagation()
  e.dataTransfer!.effectAllowed = 'move'

  e.dataTransfer!.setDragImage(canvas, 25, 25)

  expand.value = false

  props.dragTree!.setFrom(treeNode)

  props.dnd!.setDragNode(treeNode)
}

const onDragOver = (e: DragEvent) => {
  e.preventDefault()

  e.dataTransfer!.dropEffect = 'move'
}

const onDragEnter = (e: Event, treeNode: TreeNode) => {
  e.stopPropagation()

  props.dnd!.setDropNode(treeNode)

  const dragNode = props.dnd!.dragNode as TreeNode
  const dropNode = props.dnd!.dropNode as TreeNode

  if (dragNode.id !== dropNode.id) {
    props.dragTree!.toggleTreeNodeChange(dropNode)
  }
}

const onDrop = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()

  props.dragTree?.submitTreeNodeChange()

  props.dnd!.setDropNode()
  props.dnd!.setDragNode()
}
</script>

<template>
  <div
    :class="{
      'varlet-low-code-draggable-tree-node--dragging': dnd.dragNode?.id == treeNode.id,
      'varlet-low-code-draggable-tree-node__holder': treeNode.id == 'holder',
    }"
    class="varlet-low-code-draggable-tree-node"
    draggable="true"
    @dragstart="onDragStart($event, treeNode)"
    @dragenter="onDragEnter($event, treeNode)"
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
        :dnd="dnd"
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
