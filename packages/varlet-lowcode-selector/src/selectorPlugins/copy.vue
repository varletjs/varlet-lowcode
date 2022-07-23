<script setup lang="ts">
import { schemaManager, BuiltInEvents, BuiltInSchemaNodeNames } from '@varlet/lowcode-core'
import type { SchemaNode, SchemaPageNode } from '@varlet/lowcode-core'
import { Button, Icon } from '@varlet/ui'
import { defineProps } from 'vue'
import _props from '../props'

const props = defineProps(_props)

function addSchemaNode(schemaNode: SchemaNode, parentId: SchemaNode['id'], slotsName = 'default'): SchemaPageNode {
  const rootSchemaNode: SchemaPageNode =
    props.schema ??
    <SchemaPageNode>{
      name: BuiltInSchemaNodeNames.PAGE,
    }
  const { id } = schemaNode

  schemaManager!.visitSchemaNode(rootSchemaNode, (schemaNode) => {
    if (schemaNode.id === id) {
      throw new Error("SchemaNode already added. The schema's id is repeatedly")
    }

    if (schemaNode.id === parentId) {
      schemaNode.slots![slotsName].children!.push(schemaNode)
      return true
    }
  })

  return rootSchemaNode
}

const copyClick = () => {
  // const newSchema = addSchemaNode()

  // props.designerEventsManager!.emit(BuiltInEvents.SCHEMA_CHANGE, newSchema)
  console.log('props', props.schemaId)
}
</script>

<template>
  <Button @click="copyClick" round size="small" type="success">
    <Icon name="file-document-outline" />
  </Button>
</template>
