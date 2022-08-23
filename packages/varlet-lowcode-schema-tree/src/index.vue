<script setup lang="ts">
import { ref } from 'vue'
import { schemaManager } from '@varlet/lowcode-core'
import DraggableTree from './DraggableTree'
import type { Tree } from './shared'
import { transform } from './shared'

const tree = ref<Tree>(transform(schemaManager.exportSchema()))

console.log(tree.value)
</script>

<template>
  <DraggableTree v-model:tree="tree" />
</template>
