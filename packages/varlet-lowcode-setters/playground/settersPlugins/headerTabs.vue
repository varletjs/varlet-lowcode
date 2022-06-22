<script setup lang="ts">
import { ref, defineEmits, watch } from 'vue'
import { Snackbar, Button, Icon } from '@varlet/ui'

const tabIndex = ref(0)
const emit = defineEmits(['changeTabIndex'])
const tabClick = (value) => {
  tabIndex.value = value
}
watch(tabIndex, (newValue, oldValue) => {
  emit('changeTabIndex', newValue)
})
</script>
<template>
  <div class="varlet-lowcode-setters-header-tabs">
    <ul class="header-tabs-nav">
      <li class="header-tabs-tab" :class="tabIndex === 0 ? 'active' : null" tabIndex="0" @click="tabClick(0)">
        <div class="header-tabs-tab-inner">
          <span class="inner-title">属性</span>
        </div>
      </li>
      <li class="header-tabs-tab" :class="tabIndex === 1 ? 'active' : null" tabIndex="1" @click="tabClick(1)">
        <div class="header-tabs-tab-inner">
          <span class="inner-title">样式</span>
        </div>
      </li>
      <li class="header-tabs-tab" :class="tabIndex === 2 ? 'active' : null" @click="tabClick(2)">
        <div class="header-tabs-tab-inner">
          <span class="inner-title">高级</span>
        </div>
      </li>
    </ul>
  </div>
</template>
