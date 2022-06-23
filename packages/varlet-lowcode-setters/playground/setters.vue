<script setup lang="ts">
import { ref } from 'vue'
import headerPath from './settersPlugins/headerPath.vue'
import headerTabs from './settersPlugins/headerTabs.vue'
import Empty from '../src/empty'
// import { eventsManager } from '@varlet/lowcode-core'

const isDom = ref(false)
isDom.value = true
</script>

<template>
  <div class="varlet-lowcode-setters">
    <div class="varlet-lowcode-setters-content">
      <template v-if="isDom">
        <headerPath />
        <headerTabs />
      </template>
      <template v-else>
        <Empty />
      </template>
    </div>
  </div>
</template>
<style lang="less">
@import './setters.less';
</style>
