<script setup lang="ts">
import { ref } from 'vue'
import headerPath from './settersPlugins/headerPath.vue'
// import { eventsManager } from '@varlet/lowcode-core'

// const onClick = (e: Event) => {
//   eventsManager.emit('schema-click', e)
// }

const as = ref('123')
console.log(as.value, '123456')
</script>

<template>
  <div class="varlet-lowcode-setters">
    <div class="varlet-lowcode-setters-content">
      <div class="varlet-lowcode-setters-header-path">
        <headerPath />
      </div>
      <div>123456</div>
      <div>123456</div>
    </div>
  </div>
</template>
<style lang="less">
@import './app.less';
</style>
