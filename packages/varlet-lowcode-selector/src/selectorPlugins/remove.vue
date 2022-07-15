<script setup lang="ts">
import { schemaManager, BuiltInEvents, eventsManager } from '@varlet/lowcode-core'
import { Button, Icon } from '@varlet/ui'
import { defineProps } from 'vue'
import _props from './props'

const props = defineProps(_props)

const trashClick = () => {
  const rootSchema = schemaManager.exportSchema()
  const newSchema = schemaManager.removeSchemaNodeById(rootSchema, props.schemaId)

  eventsManager.emit(BuiltInEvents.SCHEMA_CHANGE, newSchema)
}
</script>
<template>
  <Button round @click="trashClick" size="small" type="danger">
    <Icon name="trash-can-outline" />
  </Button>
</template>
