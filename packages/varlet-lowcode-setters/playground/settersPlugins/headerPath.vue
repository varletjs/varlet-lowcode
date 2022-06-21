<script setup lang="ts">
import { Snackbar, Button, Icon } from '@varlet/ui'

const copyClick = () => {
  Snackbar.success('修改当前节点')
}
</script>
<template>
  <div class="f-a-c">
    <Icon name="message-processing-outline" />
    <span class="header-path-title hover" @click="copyClick">页面</span>
    <Icon name="chevron-right" />
    <span class="header-path-title hover" @click="copyClick">页面</span>
    <Icon name="chevron-right" />
    <span class="header-path-title">区域</span>
  </div>
</template>
