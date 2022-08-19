<script setup lang="ts">
import DraggableTree from './DraggableTree'
import type { Tree } from './shared'
import { transform } from './shared'
import { ref } from 'vue'
import { schemaManager } from '@varlet/lowcode-core'

const tree = ref<Tree>(transform(schemaManager.exportSchema()))
</script>

<template>
  <DraggableTree v-model:tree="tree" />
</template>
