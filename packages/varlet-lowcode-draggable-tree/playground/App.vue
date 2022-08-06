<script setup lang="ts">
import DraggableTree, { TreeNode } from '../src/index'
import { ref } from 'vue'

const tree = ref<TreeNode>({
  id: '66',
  text: 'page',
  children: [
    {
      id: '0',
      text: 'A',
    },
    {
      id: '1',
      text: 'B',
      children: [
        {
          id: '2',
          text: 'C',
        },
        {
          id: '4',
          text: 'E',
        },
        {
          id: '5',
          text: 'F',
          children: [
            {
              id: '6',
              text: 'G',
            },
            {
              id: '7',
              text: 'H',
            },
          ],
        },
      ],
    },
    {
      id: '3',
      text: 'D',
    },
  ],
})
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
