import { get } from 'lodash-es'
import type { DefineComponent } from 'vue'

export interface Asset {
  profile: string
  resources?: string[]
}

export interface AssetProfile {
  library: string
  materials: AssetProfileMaterial[]
}

export interface AssetProfileMaterial {
  name: string
  description?: string
  image?: string
  props?: any[]
}

export type Assets = Asset[]

export interface AssetsManager {
  findComponent(assets: Assets, name: string): DefineComponent

  importAssets(assets: Assets): Assets

  exportAssets(): Assets
}

export function createAssetsManager(): AssetsManager {
  let _assets: Assets

  function findComponent(assets: Assets, name: string): DefineComponent {
    const asset = assets.find((asset) => {
      const assetProfile = get(window, asset.profile) as AssetProfile

      return assetProfile.materials.some((material) => material.name === name)
    })

    if (!asset) {
      throw new Error(`Component ${name} cannot found`)
    }

    const profileLibrary = get(window, `${asset.profile}.library`)

    return get(window, `${profileLibrary}.${name}`)
  }

  function importAssets(assets: Assets) {
    _assets = JSON.parse(JSON.stringify(assets))

    return _assets
  }

  function exportAssets(): Assets {
    return JSON.parse(JSON.stringify(_assets))
  }

  return {
    findComponent,

    importAssets,

    exportAssets,
  }
}

export default createAssetsManager()
