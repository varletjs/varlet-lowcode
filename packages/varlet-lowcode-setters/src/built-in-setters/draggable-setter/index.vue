<script setup lang="ts">
import { Icon as VarIcon, Input as VarInput } from '@varlet/ui'
import { defineProps, defineEmits, ref, reactive } from 'vue'
import draggable from 'vuedraggable'
import './index.less'
import edit from '../../../assets/edit.png'
import move from '../../../assets/move.png'

const myArray: any = reactive({
  value: [
    {
      name: 'vue.js 2.0',
      order: 5,
      fixed: false,
    },
    {
      name: 'draggable',
      order: 2,
      fixed: false,
    },
    {
      name: 'component',
      order: 3,
      fixed: false,
    },
  ],
})
console.log(myArray.value, '')
</script>

<template>
  <draggable tag="ul" :list="myArray.value" class="list-group" handle=".handle" item-key="name">
    <template #item="{ element }">
      <div class="varlet-low-code-setter__table--row">
        <var-icon :name="edit" :size="24" />
        <var-input v-model="element.name"></var-input>
        <var-icon name="delete" :size="24" />
        <var-icon :name="move" class="handle" :size="24" />
      </div>
    </template>
  </draggable>
</template>
