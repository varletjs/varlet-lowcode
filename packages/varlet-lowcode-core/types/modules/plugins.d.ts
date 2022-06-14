import { DefineComponent } from 'vue'

export declare enum SkeletonLayouts {
  HEADER_LEFT = 'header-left',
  HEADER_RIGHT = 'header-right',
  HEADER_CENTER = 'header-center',
  SIDEBAR_TOP = 'sidebar-top',
  SIDEBAR_BOTTOM = 'sidebar-bottom',
}
export interface SkeletonPlugin {
  readonly name: string
  readonly layout: 'header-left' | 'header-right' | 'header-center' | 'sidebar-top' | 'sidebar-bottom'
  readonly component: DefineComponent
  readonly icon?: string | DefineComponent
}
export interface SelectorPlugin {
  readonly name: string
  readonly component: DefineComponent
}
export interface PluginsManager {
  useSkeletonPlugin(skeletonPlugin: SkeletonPlugin): void
  useSelectorPlugin(selectorPlugin: SelectorPlugin): void
  exportSkeletonPlugins(): SkeletonPlugin[]
  exportSelectorPlugins(): SelectorPlugin[]
}
export declare function createPluginsManager(): PluginsManager
declare const _default: PluginsManager
export default _default
