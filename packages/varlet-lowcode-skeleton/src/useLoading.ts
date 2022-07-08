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

  const layoutLoadingPrepares: Record<string, number> = reactive({
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
    layoutLoadingPrepares[layout]++

    setTimeout(() => {
      layoutLoadings[layout] += layoutLoadingPrepares[layout]
      layoutLoadingPrepares[layout] = 0
    }, 5000)
  }

  const handleLoaded = (layout: SkeletonLayoutLoadings) => {
    if (layoutLoadingPrepares[layout]) {
      layoutLoadingPrepares[layout]--

      return
    }

    layoutLoadings[layout]--
  }

  eventsManager.on(SkeletonLoadingEvents.SKELETON_LOADING, handleLoading)
  eventsManager.on(SkeletonLoadingEvents.SKELETON_LOADED, handleLoaded)

  onUnmounted(() => {
    eventsManager.off(SkeletonLoadingEvents.SKELETON_LOADING, handleLoading)
    eventsManager.off(SkeletonLoadingEvents.SKELETON_LOADED, handleLoaded)
  })

  const layoutLoadingsComputed = computed(() => {
    return {
      enableHeaderLeftLayout: layoutLoadings.headerLeft > 0 || layoutLoadings.fullscreen > 0,
      enableHeaderCenterLayout: layoutLoadings.headerCenter > 0 || layoutLoadings.fullscreen > 0,
      enableHeaderRightLayout: layoutLoadings.headerRight > 0 || layoutLoadings.fullscreen > 0,
      enableSidebarTopLayout: layoutLoadings.sidebarTop > 0 || layoutLoadings.fullscreen > 0,
      enableSidebarPluginLayout:
        layoutLoadings.sidebarTop > 0 || layoutLoadings.sidebarBottom > 0 || layoutLoadings.fullscreen > 0,
      enableSidebarBottomLayout: layoutLoadings.sidebarBottom > 0 || layoutLoadings.fullscreen > 0,
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
