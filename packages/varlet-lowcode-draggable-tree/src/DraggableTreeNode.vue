<script lang="ts" setup name="DraggableTreeNode">
import { TreeNode, treeNodeProps } from './props'
import { ref, defineProps, ComputedRef, computed, watch } from 'vue'
import { Icon } from '@varlet/ui'
import '@varlet/ui/es/icon/style/index.js'

const props = defineProps(treeNodeProps)
const expand = ref(false)

const clearDragEvents = ref()

const canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas')

const isNext = (e: DragEvent) => {
  const { bottom, height } = (e.target as Element).getBoundingClientRect()
  const { y } = e

  return (bottom - y) / height >= 0.5
}

const toggleExpand = () => {
  expand.value = !expand.value
}

const overNode: ComputedRef<TreeNode | undefined> = computed(() => props.dnd!.overNode)

watch(
  () => overNode.value,
  (newVal) => {
    if (newVal && newVal.id === props.treeNode.id && props.dnd?.dragNode?.id !== overNode.value?.id) {
      expand.value = true
    }
  }
)

const dragstart = (e: any, treeNode: TreeNode) => {
  expand.value = false
  props.dnd!.setDragNode(treeNode)
  props.dragTree!.setFrom(treeNode)

  clearDragEvents.value = initDragEvents()
}

const initDragEvents = () => {
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', onDrop)

  return () => {
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', onDrop)
  }
}

const onDrag = (e: any) => {
  e.preventDefault()
  e.stopPropagation()
  const t: HTMLElement | null = (e.target as Element).closest('.varlet-low-code-draggable-tree-node')
  // while (!t?.dataset?.id){
  //   t = t.parentNode
  // }

  if (!t?.dataset.id) return

  const treeNode = props.dragTree!.findNodeById(t.dataset.id)

  if (treeNode.id === 'holder') return

  props.dnd!.setDropNode(treeNode)

  if (treeNode.children) {
    props.dnd!.setOverNode(treeNode, props.dragTree!)
  }

  props.dragTree!.toggleTreeNodeChange(treeNode, isNext(e))
}

const onDrop = (e: any) => {
  e.preventDefault()
  e.stopPropagation()
  clearDragEvents.value?.()

  if (props.dnd?.timer) {
    clearTimeout(props.dnd.timer)
  }

  if (props.dnd!.dropNode?.id && props.dnd?.overNode?.id && props.dnd!.dropNode?.id === props.dnd?.overNode?.id) {
    props.dragTree!.insertNode()
  } else {
    props.dragTree!.submitTreeNodeChange(isNext(e))
  }

  props.dnd!.setDropNode()
  props.dnd!.setDragNode()
}
</script>

<template>
  <div
    :class="{
      'varlet-low-code-draggable-tree-node--dragging': dnd?.dragNode?.id === treeNode.id,
      'varlet-low-code-draggable-tree-node__holder': treeNode.id === 'holder',
    }"
    class="varlet-low-code-draggable-tree-node"
    draggable="true"
    :data-id="treeNode.id"
    :style="{
      width: treeNode.id === 'holder' ? `calc(100% - ${indent * 20}px)` : undefined,
      transform: treeNode.id === 'holder' ? `translateX(${indent * 20}px)` : undefined,
    }"
  >
    <div
      class="varlet-low-code-draggable-tree-node__title"
      :style="{
        paddingLeft: `${indent * 20}px`,
        color: dragTree.holderParentNode === treeNode ? 'blue' : undefined,
      }"
      @touchstart="dragstart($event, treeNode)"
      @dragstart="dragstart($event, treeNode)"
    >
      <Icon
        v-if="treeNode.children"
        @click="toggleExpand"
        @touch.prevent="toggleExpand"
        name="chevron-right"
        :class="expand ? 'varlet-low-code-draggable-tree-node__icon-expand' : ''"
      />
      {{ treeNode.text }}
    </div>
    <div v-if="treeNode.children && expand">
      <DraggableTreeNode
        :drag-tree="dragTree"
        :dnd="dnd"
        v-show="expand"
        :indent="indent + 1"
        :tree-node="treeChildNode"
        v-for="treeChildNode of treeNode.children"
        :key="treeChildNode.id"
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
