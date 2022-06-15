import { get } from 'lodash-es'
import type { DefineComponent } from 'vue'

export interface Asset {
  profile?: string
  resources: string[]
}

export interface AssetProfile {
  library: string
  packageName: string
  packageVersion: string
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

export type Assets = Asset[]

export interface AssetsManager {
  findComponent(assets: Assets, name: string, library: string): DefineComponent

  findMaterial(assets: Assets, name: string, library: string): AssetProfileMaterial

  findProfile(assets: Assets, name: string, library: string): AssetProfile

  getResources(assets: Assets): string[]

  loadResources(assets: Assets, document: Document): Promise<void>

  importAssets(assets: Assets): Assets

  exportAssets(): Assets
}

export function createAssetsManager(): AssetsManager {
  let _assets: Assets = []

  function findComponent(assets: Assets, name: string, library?: string): DefineComponent {
    const asset = assets.find((asset) => {
      if (!asset.profile) {
        return false
      }

      const assetProfile = get(window, asset.profile) as AssetProfile
      const matchedName = assetProfile.materials.some((material) => material.name === name)
      const matchedLibrary = library === assetProfile.library

      return matchedName && matchedLibrary
    })

    if (!asset) {
      throw new Error(`Component not found by name: ${name} and library: ${library}`)
    }

    const profileLibrary = get(window, `${asset.profile}.library`)

    return get(window, `${profileLibrary}.${name}`)
  }

  function findMaterial(assets: Assets, name: string, library: string): AssetProfileMaterial {
    for (const asset of assets) {
      if (!asset.profile) {
        continue
      }

      const assetProfile = get(window, asset.profile) as AssetProfile

      if (assetProfile.library === library) {
        for (const material of assetProfile.materials) {
          if (material.name === name) {
            return material
          }
        }
      }
    }

    throw new Error(`Material not found by name: ${name} and library: ${library}`)
  }

  function findProfile(assets: Assets, name: string, library: string): AssetProfile {
    for (const asset of assets) {
      if (!asset.profile) {
        continue
      }

      const assetProfile = get(window, asset.profile) as AssetProfile

      if (assetProfile.library === library) {
        for (const material of assetProfile.materials) {
          if (material.name === name) {
            return assetProfile
          }
        }
      }
    }

    throw new Error(`Profile not found by name: ${name} and library: ${library}`)
  }

  function getResources(assets: Assets): string[] {
    return assets.reduce((resources, asset) => {
      resources.push(...asset.resources)

      return resources
    }, [] as string[])
  }

  async function loadResources(assets: Assets, document: Document): Promise<void> {
    const asyncTasks = []

    function getTask(element: HTMLLinkElement | HTMLScriptElement) {
      return new Promise((resolve, reject) => {
        element.addEventListener('load', () => {
          resolve(undefined)
        })

        element.addEventListener('error', () => {
          reject()
        })
      })
    }

    for (const asset of assets) {
      if (asset.resources) {
        for (const resource of asset.resources) {
          let element: HTMLLinkElement | HTMLScriptElement

          if (resource.endsWith('.css')) {
            element = document.createElement('link')
            element.rel = resource
            document.head.append(element)
            asyncTasks.push(getTask(element))
          } else {
            element = document.createElement('script')
            element.src = resource
            document.body.append(element)

            await getTask(element)
          }
        }
      }
    }

    await Promise.all(asyncTasks)
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

    findMaterial,

    findProfile,

    getResources,

    loadResources,

    importAssets,

    exportAssets,
  }
}

export default createAssetsManager()
