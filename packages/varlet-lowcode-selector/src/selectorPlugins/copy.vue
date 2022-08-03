<script setup lang="ts">
import { schemaManager, BuiltInEvents, BuiltInSchemaNodeNames } from '@varlet/lowcode-core'
import type { SchemaNode, SchemaPageNode } from '@varlet/lowcode-core'
import { Button, Icon } from '@varlet/ui'
import { defineProps } from 'vue'
import _props from '../props'

const props = defineProps(_props)

function addSchemaNode(id: SchemaNode['id'], slotsName = 'default'): SchemaPageNode {
  const rootSchemaNode: SchemaPageNode =
    props.schema ??
    <SchemaPageNode>{
      name: BuiltInSchemaNodeNames.PAGE,
    }

  const firstChildren = rootSchemaNode.slots![slotsName].children ?? []

  for (const schemaChildNode of firstChildren) {
    if (schemaChildNode.id === id) {
      const newSchema = schemaManager.clone(schemaChildNode)
      newSchema.id = schemaManager.generateId()

      rootSchemaNode.slots![slotsName].children.push(newSchema)

      return rootSchemaNode
    }
  }

  schemaManager!.visitSchemaNode(rootSchemaNode, (schemaNode) => {
    !schemaManager.isSchemaTextNode(schemaNode) &&
      schemaNode.slots![slotsName].children.forEach((schemaChildNode: SchemaNode) => {
        if (schemaChildNode.id === id) {
          const newSchema = schemaManager.clone(schemaChildNode)
          newSchema.id = schemaManager.generateId()

          schemaNode.slots![slotsName].children.push(newSchema)
          return true
        }
      })
  })

  return rootSchemaNode
}

const copyClick = () => {
  const newSchema = addSchemaNode(props.schemaId)

  props.designerEventsManager!.emit(BuiltInEvents.SCHEMA_CHANGE, newSchema)
}
</script>

<template>
  <Button @click="copyClick" round size="small" type="success">
    <Icon name="file-document-outline" />
  </Button>
</template>
