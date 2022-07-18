<script setup lang="ts">
import type { SchemaNode } from '@varlet/lowcode-core'
import { schemaManager } from '@varlet/lowcode-core'
import { Button, Icon } from '@varlet/ui'
import { defineProps } from 'vue'
import _props from './props'

const props = defineProps(_props)

function addSchemaNode(schemaNode: SchemaNode, parentId: SchemaNode['id'], slotsName = 'default'): SchemaNode {
  const rootSchemaNode = schemaManager.exportSchema()
  const { id } = schemaNode

  schemaManager.visitSchemaNode(rootSchemaNode, (schemaNode) => {
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
  console.log('props', props.schemaId)
}
</script>

<template>
  <Button @click="copyClick" round size="small" type="success">
    <Icon name="file-document-outline" />
  </Button>
</template>
