<script lang="ts" setup name="DraggableTreeNode">
import { treeNodeProps } from './props'
import { ref, defineProps } from 'vue'
import { Icon } from '@varlet/ui'
import '@varlet/ui/es/icon/style/index.js'

const props = defineProps(treeNodeProps)
const expand = ref(false)

const toggleExpand = () => {
  expand.value = !expand.value
}
</script>

<template>
  <div class="varlet-low-code-draggable-tree-node">
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
