<script lang="ts" setup name="DraggableTreeNode">
import { ref, defineProps, PropType, toRaw } from 'vue'
import { Icon } from '@varlet/ui'
import { onChangeNodeTree, onSubmit, dragData, onEnterNodeTree, dndTree } from './provider'
import '@varlet/ui/es/icon/style/index.js'

export interface TreeNode {
  id: string
  text?: string
  children?: TreeNode[]
}

const expand = ref(false)

const calcPosition = (e: DragEvent) => {
  const { bottom, height } = (e.target as Element).getBoundingClientRect()
  const { y } = e

  return (bottom - y) / height >= 0.5 ? 'down' : 'up'
}

const props = defineProps({
  treeNode: {
    type: Object as PropType<TreeNode>,
    required: true,
    default: () => ({}),
  },
  level: {
    type: Number,
    default: 1,
  },
})

const handleIconClick = () => {
  expand.value = !expand.value
}

const onDragStart = (e: DragEvent) => {
  const _treeNode = JSON.stringify(props.treeNode)
  dragData.value = props.treeNode

  e.dataTransfer && e.dataTransfer.setData('text', _treeNode)

  e.dataTransfer && (e.dataTransfer.effectAllowed = 'move')
}

const onDragOver = (e: DragEvent) => {
  e.preventDefault()
  e.dataTransfer && (e.dataTransfer.dropEffect = 'move')
}

const onDragEnter = (e: DragEvent) => {
  e.preventDefault()

  if (e.target !== e.currentTarget) return

  if (dragData.value?.id === props.treeNode.id) return

  onChangeNodeTree({ start: toRaw(dragData.value), end: JSON.parse(JSON.stringify(props.treeNode)) }, calcPosition(e))
}

const onEnterChildren = (e: DragEvent) => {
  expand.value = true

  if (e.target !== e.currentTarget) return

  if (dragData.value?.id === props.treeNode.id) return

  if (props.treeNode?.children && !props.treeNode.children.length) {
    e.stopPropagation()

    onEnterNodeTree({ start: toRaw(dragData.value), end: JSON.parse(JSON.stringify(props.treeNode)) })
  }
}

const onDrop = () => {
  onSubmit.value?.(dndTree.value)
}
</script>

<template>
  <div class="varlet-low-code-draggable-tree-node">
    <div
      @dragstart.stop="onDragStart"
      @dragover.prevent="onDragOver"
      @dragenter.stop="onDragEnter"
      class="varlet-low-code-draggable-tree-node__title"
      draggable="true"
      :style="{
        paddingLeft: `${(level ? level : 1) * 20}px`,
      }"
    >
      <Icon
        v-if="treeNode.children"
        :style="{ left: `${((level ? level : 1) - 1) * 20}px` }"
        class="varlet-low-code-draggable-tree-node__title-icon"
        name="chevron-right"
        :class="expand ? 'varlet-low-code-draggable-tree-node__icon-expand' : ''"
        @click="handleIconClick"
      />
      <div @dragenter="onEnterChildren" class="varlet-low-code-draggable-tree-node__title-name">
        {{ treeNode.text }}
      </div>
    </div>
    <div v-if="treeNode.children && expand">
      <DraggableTreeNode
        v-show="expand"
        :tree-node="treeChildNode"
        v-for="treeChildNode of treeNode.children"
        :key="treeChildNode.id"
        :level="level + 1"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.varlet-low-code-draggable-tree-node {
  &__title {
    display: flex;
    align-items: center;
    height: 30px;
    padding-left: 20px;
    position: relative;

    &-icon {
      position: absolute;
      left: 0;
    }

    &-name {
      height: 30px;
      line-height: 30px;
    }

    &:hover {
      background: rgba(31, 56, 88, 0.06);
    }
  }

  &__icon-expand {
    transform: rotate(90deg);
  }

  &--dragging {
    background: red;
  }

  &__holder {
    border: 1px #3a7afe dashed;
    cursor: move;
  }
}
</style>
