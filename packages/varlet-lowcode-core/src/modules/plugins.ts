import type { Component, DefineComponent } from 'vue'

export enum SkeletonLayouts {
  HEADER_LEFT = 'header-left',
  HEADER_RIGHT = 'header-right',
  HEADER_CENTER = 'header-center',
  SIDEBAR_TOP = 'sidebar-top',
  SIDEBAR_BOTTOM = 'sidebar-bottom',
  DESIGNER = 'designer',
  SETTERS = 'setters',
}

export interface SkeletonPlugin {
  readonly layout: SkeletonLayouts
  readonly component: Component | DefineComponent
  readonly componentProps?: Record<string, any>
  readonly icon?: string | Component | DefineComponent
  readonly label?: string
}

export interface SelectorPlugin {
  readonly component: Component | DefineComponent
  readonly componentProps?: Record<string, any>
}

export interface PluginsManager {
  useSkeletonPlugin(skeletonPlugin: SkeletonPlugin): PluginsManager
  useSelectorPlugin(selectorPlugin: SelectorPlugin): PluginsManager

  exportSkeletonPlugins(): SkeletonPlugin[]
  exportSelectorPlugins(): SelectorPlugin[]
}

export function createPluginsManager(): PluginsManager {
  const skeletonPlugins: SkeletonPlugin[] = []
  const selectorPlugins: SelectorPlugin[] = []

  const pluginManager: PluginsManager = {
    useSkeletonPlugin,
    useSelectorPlugin,

    exportSkeletonPlugins,
    exportSelectorPlugins,
  }

  function useSkeletonPlugin(skeletonPlugin: SkeletonPlugin): PluginsManager {
    skeletonPlugins.push(skeletonPlugin)

    return pluginManager
  }

  function useSelectorPlugin(selectorPlugin: SelectorPlugin): PluginsManager {
    selectorPlugins.push(selectorPlugin)

    return pluginManager
  }

  function exportSkeletonPlugins() {
    return skeletonPlugins
  }

  function exportSelectorPlugins() {
    return selectorPlugins
  }

  return pluginManager
}

export default createPluginsManager()
