import type { DefineComponent } from 'vue'

export interface Asset {
  profile?: string
  resources?: string[]
}
export interface AssetProfile {
  library: string
  materials: AssetProfileMaterial[]
}
export interface AssetProfileMaterialCodegen {
  name: string
}
export interface AssetProfileMaterialSlot {
  name: string
  hasSlotProps: boolean
}
export interface AssetProfileMaterial {
  name: string
  description?: string
  image?: string
  props?: any[]
  slots?: AssetProfileMaterialSlot[]
  codegen: AssetProfileMaterialCodegen
}
export declare type Assets = Asset[]
export interface AssetsManager {
  findComponent(assets: Assets, name: string): DefineComponent
  findMaterial(assets: Assets, name: string): AssetProfileMaterial
  loadResources(assets: Assets, document: Document): Promise<void>
  importAssets(assets: Assets): Assets
  exportAssets(): Assets
}
export declare function createAssetsManager(): AssetsManager
declare const _default: AssetsManager
export default _default
