<script setup lang="ts">
import { Snackbar, Button, Icon } from '@varlet/ui'

const copyClick = () => {
  Snackbar.success('修改当前节点')
}
</script>
<template>
  <div class="f-a-c varlet-lowcode-setters-header-path">
    <!-- <Icon name="message-processing-outline" /> -->
    <img
      src="https://alifd.oss-cn-hangzhou.aliyuncs.com/fusion-cool/icons/icon-light/ic_light_table.png"
      alt=""
      :style="{ width: '16px', height: '16px', marginRight: '5px' }"
    />
    <span class="header-path-title hover" @click="copyClick">页面</span>
    <Icon name="chevron-right" />
    <span class="header-path-title hover" @click="copyClick">页面</span>
    <Icon name="chevron-right" />
    <span class="header-path-title">区域</span>
  </div>
</template>
