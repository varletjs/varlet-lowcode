<script setup lang="ts">
import { BuiltInSchemaNodeNames, BuiltInEvents, schemaManager } from '@varlet/lowcode-core'
import type { SchemaPageNode } from '@varlet/lowcode-core'
import { Button, Icon } from '@varlet/ui'
import { defineProps } from 'vue'
import _props from '../props'

const props = defineProps(_props)

const trashClick = () => {
  if (props.schemaId) {
    const rootSchema = props.schema ?? ({ name: BuiltInSchemaNodeNames.PAGE } as SchemaPageNode)
    const newSchema = schemaManager!.removeSchemaNodeById(rootSchema, props.schemaId)

    props.designerEventsManager!.emit(BuiltInEvents.SCHEMA_CHANGE, newSchema)
  }
}
</script>
<template>
  <Button round @click="trashClick" size="small" type="danger">
    <Icon name="trash-can-outline" />
  </Button>
</template>
