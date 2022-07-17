<script setup lang="ts">
import DraggableTree from '../src/index'
import { ref } from 'vue'

const tree = ref([
  {
    id: 0,
    text: 'A',
  },
  {
    id: 1,
    text: 'B',
    children: [
      {
        id: 2,
        text: 'C',
      },
      {
        id: 4,
        text: 'E',
      },
      {
        id: 5,
        text: 'F',
        children: [
          {
            id: 6,
            text: 'G',
          },
          {
            id: 7,
            text: 'H',
          },
        ],
      },
    ],
  },
  {
    id: 3,
    text: 'D',
  },
])
</script>

<template>
  <div style="width: 400px; background: #eee">
    <DraggableTree v-model:tree="tree" />
  </div>
</template>
