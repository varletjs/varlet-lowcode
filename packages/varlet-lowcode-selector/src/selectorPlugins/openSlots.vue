<script setup lang="ts">
import { Button, Icon } from '@varlet/ui'
import { defineProps } from 'vue'
import _props from './props'

const props = defineProps(_props)

const menuOpen = () => {
  console.log('props', props.schemaId)
}
</script>
<template>
  <Button @click="menuOpen" round size="small" type="warning">
    <Icon name="menu" />
  </Button>
</template>
