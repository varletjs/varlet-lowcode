<script setup lang="ts">
import { AssetProfileMaterialSlot, SchemaNode, schemaManager, assetsManager } from '@varlet/lowcode-core'
import { Button, Icon, Menu, Cell } from '@varlet/ui'
import { defineProps, ref } from 'vue'
import _props from '../props'

const menuList = ref<AssetProfileMaterialSlot[]>([])

const props = defineProps(_props)

const show = ref(false)

// let assets = assetsManager.exportAssets()

function getProfiles() {
  return props.assets && assetsManager.getProfiles(props.assets)
}

const getMenu = () => {
  const profiles = getProfiles()
  if (profiles && profiles.length && props.schemaId) {
    const schema = props.schema as SchemaNode
    const schemaNode = schemaManager.findSchemaNodeById(schema, props.schemaId)
    const { name, library } = schemaNode || {}

    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i]

      if (profile.library === library) {
        const { materials = [] } = profile

        for (let j = 0; j < materials.length; j++) {
          if (materials[j].name === name) {
            menuList.value = materials[j].slots || []

            break
          }
        }
      }
    }
  }

  // console.log('name', name);
  // console.log('library', library);

  // TODO: Find the slots list by name and library in the profiles
}
// ButtonVarlet

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
        <Cell v-for="materialSlot in menuList" :key="materialSlot.name">{{ materialSlot.name }}</Cell>
      </div>
    </template>
  </Menu>
</template>

<style scoped>
.varlet-low-code-selector--cell-list {
  background: #fff;
}
</style>
