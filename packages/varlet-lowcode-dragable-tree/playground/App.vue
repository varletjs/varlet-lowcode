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
    ],
  },
  {
    id: 3,
    text: 'D',
  },
]
</script>

<template>
  <DragableTree :tree="tree" />
</template>
