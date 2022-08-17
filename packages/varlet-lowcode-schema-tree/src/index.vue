<script setup lang="ts">
import DraggableTree from './DraggableTree'
import type { Tree } from './shared'
import { transform } from './shared'
import { ref } from 'vue'
import { schemaManager } from '@varlet/lowcode-core'

const tree = ref<Tree>(transform(schemaManager.exportSchema()))
</script>

<template>
  <div style="width: 400px; background: #eee">
    <DraggableTree v-model:tree="tree" />
  </div>
</template>

<style scoped>
.ttt {
  position: fixed;
  top: 118px;
  left: 118px;
}
</style>
