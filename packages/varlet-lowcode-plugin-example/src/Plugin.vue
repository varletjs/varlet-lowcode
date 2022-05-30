<script setup lang="ts">
import { ref, Ref } from 'vue'

const count: Ref<number> = ref(0)
</script>

<template>
  <button class="plugin-style" @click="count++">{{ count }}</button>
</template>

<style lang="less">
.plugin-style {
  color: cornflowerblue;
}
</style>
