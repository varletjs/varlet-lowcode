<script setup lang="ts">
import { Snackbar, Button, Icon } from '@varlet/ui'

const copyClick = () => {
  Snackbar.warning('Happy birthday to you')
}
</script>
<template>
  <Button @click="copyClick" round size="small" type="warning">
    <Icon name="cake-variant" />
  </Button>
</template>
