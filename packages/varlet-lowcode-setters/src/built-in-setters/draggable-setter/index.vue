<script setup lang="ts">
import { Icon as VarIcon, Input as VarInput } from '@varlet/ui'
import { ref, reactive, Ref, toRaw } from 'vue'
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

const from: Ref<any> = ref()
const to: Ref<any> = ref()

const onDragStart = (e: DragEvent, item: any) => {
  e.stopPropagation()

  e.dataTransfer!.effectAllowed = 'move'

  from.value = item
}

const onDragEnter = (e: Event, item: any) => {
  e.stopPropagation()
  to.value = item

  const { order } = from.value

  from.value.order = to.value.order

  to.value.order = order

  myArray.value = myArray.value.sort((a: any, b: any) => a.order - b.order)
}
</script>

<template>
  <div
    class="varlet-low-code-setter__table--row"
    v-for="(item, index) in myArray.value"
    :key="index"
    draggable="true"
    @dragstart="onDragStart($event, item)"
    @dragenter="onDragEnter($event, item)"
  >
    <var-icon :name="edit" :size="24" @click="openEdit(item)" />
    <var-input v-model="item.name"></var-input>
    <var-icon name="delete" :size="24" @Click="deleteTableRow(index)" />
    <var-icon :name="move" class="handle" :size="24" />
  </div>

  <span class="varlet-low-code-setter__add-button" @Click="addTableRow"> 添加一项 + </span>
  <DialogDetail v-model="showDialog" />
</template>
