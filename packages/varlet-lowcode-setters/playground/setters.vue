<script setup lang="ts">
import { ref } from 'vue'
import headerPath from './settersPlugins/headerPath.vue'
import headerTabs from './settersPlugins/headerTabs.vue'
import SettersContent from '../src/settersContent'
import Empty from '../src/empty'
// import { eventsManager } from '@varlet/lowcode-core'

const isDom = ref(false)
const tabIndex = ref(0)
isDom.value = true
const changeTabIndex = (val: number) => {
  tabIndex.value = val
}
</script>

<template>
  <div class="varlet-lowcode-setters">
    <div class="varlet-lowcode-setters-content">
      <template v-if="isDom">
        <headerPath />
        <headerTabs @changeTabIndex="changeTabIndex" />
        <SettersContent :tab-index="tabIndex" />
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
