<script setup lang="ts">
import { schemaManager } from '@varlet/lowcode-core'
import { Button, Icon, Menu, Cell } from '@varlet/ui'
import { defineProps, ref } from 'vue'
import _props from '../props'

const props = defineProps(_props)

const show = ref(false)

const getMenu = () => {
  console.log('props', props)
  const schemaNode = schemaManager.findSchemaNodeById(props.schema, props.schemaId)
  const { name, library } = schemaNode

  // TODO: Find the slots list by name and library in the profiles
}

const menuOpen = () => {
  show.value = true
  getMenu()
}
</script>

<template>
  <Menu v-model:show="show" :offset-y="36">
    <Button @click="menuOpen" round size="small" type="warning">
      <Icon name="menu" />
    </Button>

    <template #menu>
      <div class="varlet-low-code-selector--cell-list">
        <Cell>菜单项</Cell>
        <Cell>菜单项</Cell>
        <Cell>菜单项</Cell>
      </div>
    </template>
  </Menu>
</template>

<style scoped>
.varlet-low-code-selector--cell-list {
  background: #fff;
}
</style>
