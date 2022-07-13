<script setup lang="ts">
import DragableTree from '../src/DragableTree'

const tree = [
  {
    id: 0,
    text: 'A',
    expanded: true, // required on each item if using the expandable option
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
]
</script>

<template>
  <div style="width: 400px; background: #eee">
    <DragableTree :tree="tree" />
  </div>
</template>
