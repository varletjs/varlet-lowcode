<script setup lang="ts">
import { Button, Icon } from '@varlet/ui'
import { defineProps } from 'vue'
import _props from './props'

const props = defineProps(_props)

const trashClick = () => {
  console.log('props', props.schemaId)
}
</script>
<template>
  <Button round @click="trashClick" size="small" type="danger">
    <Icon name="trash-can-outline" />
  </Button>
</template>
