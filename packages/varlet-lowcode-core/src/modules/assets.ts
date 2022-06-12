import { get } from 'lodash-es'
import type { DefineComponent } from 'vue'

export interface Asset {
  profile?: string
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

  loadResources(assets: Assets, document: Document): Promise<void>

  importAssets(assets: Assets): Assets

  exportAssets(): Assets
}

export function createAssetsManager(): AssetsManager {
  let _assets: Assets

  function findComponent(assets: Assets, name: string): DefineComponent {
    const asset = assets.find((asset) => {
      if (!asset.profile) {
        return false
      }

      const assetProfile = get(window, asset.profile) as AssetProfile

      return assetProfile.materials.some((material) => material.name === name)
    })

    if (!asset) {
      throw new Error(`Component ${name} cannot found`)
    }

    const profileLibrary = get(self, `${asset.profile}.library`)

    return get(self, `${profileLibrary}.${name}`)
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

    loadResources,

    importAssets,

    exportAssets,
  }
}

export default createAssetsManager()
