<script lang="ts" setup name="VarletLowcodeDraggableTree">
import { PropType, defineProps, onMounted, watch } from 'vue'
import DraggableTreeNode from './DraggableTreeNode.vue'
import { dndTree, onSubmit } from './provider'
import type { Tree } from '../index'

const props = defineProps({
  tree: {
    type: Object as PropType<Tree>,
    required: true,
    default: () => ({}),
  },
  'onUpdate:tree': {
    type: Function as PropType<(value: Tree) => void>,
  },
})

watch(
  () => props.tree,
  (newVal) => {
    dndTree.value = JSON.parse(JSON.stringify(newVal))
  },
  {
    immediate: true,
  }
)

onMounted(() => {
  onSubmit.value = props['onUpdate:tree']
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
