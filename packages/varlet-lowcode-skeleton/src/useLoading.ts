import { computed, onUnmounted, reactive } from 'vue'
import { eventsManager } from '@varlet/lowcode-core'

export enum SkeletonLayoutLoadings {
  HEADER_LEFT = 'headerLeft',
  HEADER_CENTER = 'headerCenter',
  HEADER_RIGHT = 'headerRight',
  SIDEBAR_TOP = 'sidebarTop',
  SIDEBAR_BOTTOM = 'sidebarBottom',
  DESIGNER = 'designer',
  SETTERS = 'setters',
  FULLSCREEN = 'fullscreen',
}

export enum SkeletonLoadingEvents {
  SKELETON_LOADING = 'skeleton-loading',
  SKELETON_LOADED = 'skeleton-loaded',
}

export function useLoading() {
  const layoutLoadings: Record<string, number> = reactive({
    headerLeft: 0,
    headerCenter: 0,
    headerRight: 0,
    sidebarTop: 0,
    sidebarBottom: 0,
    designer: 0,
    setters: 0,
    fullscreen: 0,
  })

  const handleLoading = (layout: SkeletonLayoutLoadings) => {
    layoutLoadings[layout]++
  }

  const handleLoaded = (layout: SkeletonLayoutLoadings) => {
    layoutLoadings[layout]--
  }

  eventsManager.on(SkeletonLoadingEvents.SKELETON_LOADING, handleLoading)
  eventsManager.on(SkeletonLoadingEvents.SKELETON_LOADED, handleLoaded)

  onUnmounted(() => {
    eventsManager.off(SkeletonLoadingEvents.SKELETON_LOADING, handleLoading)
    eventsManager.off(SkeletonLoadingEvents.SKELETON_LOADED, handleLoading)
  })

  const layoutLoadingsComputed = computed(() => {
    return {
      headerLeft: Boolean(layoutLoadings.headerLeft) || Boolean(layoutLoadings.fullscreen),
      headerCenter: Boolean(layoutLoadings.headerCenter) || Boolean(layoutLoadings.fullscreen),
      headerRight: Boolean(layoutLoadings.headerRight) || Boolean(layoutLoadings.fullscreen),
      sidebarTop: Boolean(layoutLoadings.sidebarTop) || Boolean(layoutLoadings.fullscreen),
      sidebarBottom: Boolean(layoutLoadings.sidebarBottom) || Boolean(layoutLoadings.fullscreen),
      designer: Boolean(layoutLoadings.designer) || Boolean(layoutLoadings.fullscreen),
      setters: Boolean(layoutLoadings.setters) || Boolean(layoutLoadings.fullscreen),
      fullscreen: Boolean(layoutLoadings.fullscreen),
    }
  })

  return {
    layoutLoadings,
    layoutLoadingsComputed,
  }
}
