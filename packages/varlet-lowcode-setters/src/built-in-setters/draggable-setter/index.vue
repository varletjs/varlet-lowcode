<script setup lang="ts">
import { Icon as VarIcon, Input as VarInput } from '@varlet/ui'
import { ref, reactive } from 'vue'
import draggable from 'vuedraggable'
import DialogDetail from '../../component/dialog-detail/index'
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
const addTableRow = () => {
  const object = {
    name: 'component',
    order: 3,
    fixed: false,
  }
  myArray.value.push(object)
}
const deleteTableRow = (index: any) => {
  myArray.value.splice(index, 1)
}
const openEdit = (index: any) => {
  showDialog.value = !showDialog.value
}
const showDialog = ref(false)
const stopTouch = (e: any) => {
  e.stopPropagation()
}
</script>

<template>
  <draggable tag="ul" :list="myArray.value" handle=".handle" item-key="name" @touchstart="stopTouch">
    <template #item="{ element, index }">
      <div class="varlet-low-code-setter__table--row">
        <var-icon :name="edit" :size="24" @click="openEdit(element)" />
        <var-input v-model="element.name"></var-input>
        <var-icon name="delete" :size="24" @Click="deleteTableRow(index)" />
        <var-icon :name="move" class="handle" :size="24" />
      </div>
    </template>
  </draggable>
  <span class="varlet-low-code-setter__add-button" @Click="addTableRow"> 添加一项 + </span>
  <DialogDetail v-model="showDialog" />
</template>
