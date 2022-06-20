<script setup lang="ts">
import { Snackbar, Button, Icon } from '@varlet/ui'

const copyClick = () => {
  Snackbar.success("Successfully ! Let's check it out.")
}
</script>
<template>
  <Button @click="copyClick" round size="small" type="success">
    <Icon name="file-document-outline" />
  </Button>
</template>
