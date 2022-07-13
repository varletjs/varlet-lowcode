import { computed, onUnmounted, reactive } from 'vue'
import { eventsManager } from '@varlet/lowcode-core'
import { SkeletonEvents, SkeletonLoaders } from './types'

const LOADING_DELAY = 300
const LOADED_DELAY = 600

export function useLoading() {
  const layoutLoadings: Record<string, number> = reactive({
    'header-left': 0,
    'header-center': 0,
    'header-right': 0,
    'sidebar-top': 0,
    'sidebar-bottom': 0,
    designer: 0,
    setters: 0,
    fullscreen: 0,
  })

  const layoutPendingLoadings: Record<string, number> = reactive({
    'header-left': 0,
    'header-center': 0,
    'header-right': 0,
    'sidebar-top': 0,
    'sidebar-bottom': 0,
    designer: 0,
    setters: 0,
    fullscreen: 0,
  })

  const handleLoading = (loader: SkeletonLoaders, delay?: number) => {
    layoutPendingLoadings[loader]++

    setTimeout(() => {
      if (layoutPendingLoadings[loader] > 0) {
        layoutLoadings[loader]++
        layoutPendingLoadings[loader]--
      }
    }, delay ?? LOADING_DELAY)
  }

  const handleLoaded = (layout: SkeletonLoaders) => {
    if (layoutPendingLoadings[layout] > 0) {
      layoutPendingLoadings[layout]--
      return
    }

    setTimeout(() => {
      layoutLoadings[layout]--
    }, LOADED_DELAY)
  }

  eventsManager.on(SkeletonEvents.LOADING, handleLoading)
  eventsManager.on(SkeletonEvents.LOADED, handleLoaded)

  onUnmounted(() => {
    eventsManager.off(SkeletonEvents.LOADING, handleLoading)
    eventsManager.off(SkeletonEvents.LOADED, handleLoaded)
  })

  const layoutLoadingsComputed = computed(() => {
    return {
      enableHeaderLeftLayout: layoutLoadings['header-left'] > 0 || layoutLoadings.fullscreen > 0,
      enableHeaderCenterLayout: layoutLoadings['header-center'] > 0 || layoutLoadings.fullscreen > 0,
      enableHeaderRightLayout: layoutLoadings['header-right'] > 0 || layoutLoadings.fullscreen > 0,
      enableSidebarTopLayout: layoutLoadings['sidebar-top'] > 0 || layoutLoadings.fullscreen > 0,
      enableSidebarPluginLayout:
        layoutLoadings['sidebar-top'] > 0 || layoutLoadings['sidebar-bottom'] > 0 || layoutLoadings.fullscreen > 0,
      enableSidebarBottomLayout: layoutLoadings['sidebar-bottom'] > 0 || layoutLoadings.fullscreen > 0,
      enableDesignerLayout: layoutLoadings.designer > 0 || layoutLoadings.fullscreen > 0,
      enableSettersLayout: layoutLoadings.setters > 0 || layoutLoadings.fullscreen > 0,
      enableFullscreenLayout: layoutLoadings.fullscreen > 0,
    }
  })

  return {
    layoutLoadings,
    layoutLoadingsComputed,
  }
}
