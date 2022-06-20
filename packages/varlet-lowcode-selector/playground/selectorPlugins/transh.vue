<script setup lang="ts">
import { Snackbar, Button, Icon } from '@varlet/ui'

const trashClick = () => {
  Snackbar.error('Trashed ! This is a dangerous operation.')
}
</script>
<template>
  <Button round @click="trashClick" size="small" type="danger">
    <Icon name="trash-can-outline" />
  </Button>
</template>
