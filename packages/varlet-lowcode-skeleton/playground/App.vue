<script setup lang="ts">
import Skeleton from '../src/Skeleton'
import { eventsManager } from '@varlet/lowcode-core'
import { SkeletonLayoutLoadings, SkeletonLoadingEvents } from '../src/useLoading'

setTimeout(() => {
  eventsManager.emit(SkeletonLoadingEvents.SKELETON_LOADING, SkeletonLayoutLoadings.HEADER_LEFT)
  eventsManager.emit(SkeletonLoadingEvents.SKELETON_LOADING, SkeletonLayoutLoadings.HEADER_CENTER)
  eventsManager.emit(SkeletonLoadingEvents.SKELETON_LOADING, SkeletonLayoutLoadings.HEADER_CENTER)
  eventsManager.emit(SkeletonLoadingEvents.SKELETON_LOADING, SkeletonLayoutLoadings.HEADER_CENTER)
  eventsManager.emit(SkeletonLoadingEvents.SKELETON_LOADING, SkeletonLayoutLoadings.HEADER_CENTER)
  eventsManager.emit(SkeletonLoadingEvents.SKELETON_LOADING, SkeletonLayoutLoadings.HEADER_RIGHT)

  eventsManager.emit(SkeletonLoadingEvents.SKELETON_LOADED, SkeletonLayoutLoadings.HEADER_LEFT)

  setTimeout(() => {
    eventsManager.emit(SkeletonLoadingEvents.SKELETON_LOADED, SkeletonLayoutLoadings.HEADER_CENTER)
  }, 5000)

  setTimeout(() => {
    eventsManager.emit(SkeletonLoadingEvents.SKELETON_LOADED, SkeletonLayoutLoadings.HEADER_CENTER)
  }, 500)

  setTimeout(() => {
    eventsManager.emit(SkeletonLoadingEvents.SKELETON_LOADED, SkeletonLayoutLoadings.HEADER_CENTER)
  }, 6000)

  setTimeout(() => {
    eventsManager.emit(SkeletonLoadingEvents.SKELETON_LOADED, SkeletonLayoutLoadings.HEADER_CENTER)
  }, 4000)

  setTimeout(() => {
    eventsManager.emit(SkeletonLoadingEvents.SKELETON_LOADED, SkeletonLayoutLoadings.HEADER_RIGHT)
  }, 5000)
}, 1000)
</script>

<template>
  <div class="main">
    <skeleton />
  </div>
</template>
<style scoped>
.main {
  width: 100%;
  height: 100vh;
}
</style>
