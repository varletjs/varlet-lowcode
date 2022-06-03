export declare type Assets = any
export interface AssetsManager {
  importAssets(assets: Assets): void
  exportAssets(): any
}
export declare function createAssetsManager(): AssetsManager
declare const _default: AssetsManager
export default _default
