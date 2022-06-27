<script setup lang="ts">
import { ref } from 'vue'
import SettersContent from '../../src/settersContent'

const tabIndex = ref(0)
const tabClick = (value) => {
  tabIndex.value = value
}
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
      <li class="header-tabs-tab" :class="tabIndex === 2 ? 'active' : null" tabIndex="2" @click="tabClick(2)">
        <div class="header-tabs-tab-inner">
          <span class="inner-title">事件</span>
        </div>
      </li>
      <li class="header-tabs-tab" :class="tabIndex === 3 ? 'active' : null" @click="tabClick(3)">
        <div class="header-tabs-tab-inner">
          <span class="inner-title">高级</span>
        </div>
      </li>
    </ul>
  </div>

  <SettersContent :tab-index="tabIndex" />
</template>
