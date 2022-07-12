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

export type SkeletonLayoutProps = Record<string, any>

export interface Plugin {
  readonly name: string
  component: Component | DefineComponent
  componentProps?: Record<string, any>
}

export interface SkeletonPlugin extends Plugin {
  layout: SkeletonLayouts
  layoutProps?: SkeletonLayoutProps
}

export interface SelectorPlugin extends Plugin {}

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
    if (skeletonPlugins.some((_skeletonPlugin) => _skeletonPlugin.name === skeletonPlugin.name)) {
      console.warn('Skeleton plugins registered with the same name will be automatically ignored')
      return pluginManager
    }

    skeletonPlugins.push(skeletonPlugin)

    return pluginManager
  }

  function useSelectorPlugin(selectorPlugin: SelectorPlugin): PluginsManager {
    if (selectorPlugins.some((_selectorPlugin) => _selectorPlugin.name === selectorPlugin.name)) {
      console.warn('Selector plugins registered with the same name will be automatically ignored')
      return pluginManager
    }

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
