let assetsInstance: any = null

export interface Assets {
  importAssets(assets: any): void

  exportAssets(): any
}

export function importAssets(assets: any) {
  assetsInstance = assets
}

export function exportAssets(): any {
  return assetsInstance
}

export const assets: Assets = {
  importAssets,

  exportAssets,
}

export default assets
