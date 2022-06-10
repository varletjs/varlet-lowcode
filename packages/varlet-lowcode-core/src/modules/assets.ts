export type Assets = any

export interface AssetsManager {
  importAssets(assets: Assets): void

  exportAssets(): any
}

export function createAssetsManager(): AssetsManager {
  let _assets: Assets

  const assetsManager: AssetsManager = {
    importAssets(assets: Assets): Assets {
      _assets = JSON.parse(JSON.stringify(assets))
    },

    exportAssets(): Assets {
      return _assets
    },
  }

  return assetsManager
}

export default createAssetsManager()
