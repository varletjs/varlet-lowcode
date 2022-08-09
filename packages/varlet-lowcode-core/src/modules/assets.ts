import { get } from 'lodash-es'
import type { Component, DefineComponent } from 'vue'
import type { SchemaNode } from './schema'

export interface Asset {
  profileLibrary?: string
  profileResource?: string
  additionResources?: string[]
}

export interface AssetProfile {
  library: string
  packageName: string
  packageVersion: string
  materials?: AssetProfileMaterial[]
  isVuePlugin?: boolean
}

export interface AssetProfileMaterialCodegen {
  name: string
}

export interface AssetProfileMaterialSlot {
  name: string
  hasSlotProps?: boolean
}

export interface AssetProfileMaterialSetterOptions {
  setter: string | Component | DefineComponent
  block?: boolean
  props?: Record<string, any>
}

export type AssetProfileMaterialSetter = string | AssetProfileMaterialSetterOptions

export interface AssetProfileMaterialProp {
  name: string
  label?: string
  defaultValue?: any
  visible?: Function
  setters: AssetProfileMaterialSetter[]
}

export interface AssetProfileMaterialSnapshot {
  schemas: SchemaNode[]
  image?: string
  label?: string
}

export interface AssetProfileMaterial {
  name: string
  snapshots?: AssetProfileMaterialSnapshot[]
  props?: AssetProfileMaterialProp[]
  slots?: AssetProfileMaterialSlot[]
  codegen: AssetProfileMaterialCodegen
}

export type Assets = Asset[]

export interface AssetsManager {
  findComponent(assets: Assets, name: string, library: string): DefineComponent

  findMaterial(assets: Assets, name: string, library: string): AssetProfileMaterial

  findProfile(assets: Assets, name: string, library: string): AssetProfile

  getProfiles(assets: Assets): AssetProfile[]

  getResources(assets: Assets, excludeProfileResource?: boolean): string[]

  loadResources(assets: Assets, document: Document, excludeProfileResource?: boolean): Promise<void>

  unloadResources(assets: Assets, document: Document): void

  importAssets(assets: Assets): Assets | boolean
  importAssets(assets: Assets, payload?: any): Assets | boolean

  exportAssets(): Assets
}

export function createAssetsManager(): AssetsManager {
  let _assets: Assets = []

  function findComponent(assets: Assets, name: string, library?: string): DefineComponent {
    const asset = assets.find((asset) => {
      if (!asset.profileLibrary) {
        return false
      }

      const assetProfile = get(window, asset.profileLibrary) as AssetProfile
      const matchedName = (assetProfile.materials ?? []).some((material) => material.name === name)
      const matchedLibrary = library === assetProfile.library

      return matchedName && matchedLibrary
    })

    if (!asset) {
      throw new Error(`Component not found by name: ${name} and library: ${library}`)
    }

    const profileLibrary = get(window, `${asset.profileLibrary}.library`)

    return get(window, `${profileLibrary}.${name}`)
  }

  function findMaterial(assets: Assets, name: string, library: string): AssetProfileMaterial {
    for (const asset of assets) {
      if (!asset.profileLibrary) {
        continue
      }

      const assetProfile = get(window, asset.profileLibrary) as AssetProfile

      if (assetProfile.library === library) {
        for (const material of assetProfile.materials ?? []) {
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
      if (!asset.profileLibrary) {
        continue
      }

      const assetProfile = get(window, asset.profileLibrary) as AssetProfile

      if (assetProfile.library === library) {
        for (const material of assetProfile.materials ?? []) {
          if (material.name === name) {
            return assetProfile
          }
        }
      }
    }

    throw new Error(`Profile not found by name: ${name} and library: ${library}`)
  }

  function getResources(assets: Assets, excludeProfileResource = false): string[] {
    return assets.reduce((resources, asset) => {
      resources.push(...(asset.additionResources ?? []))

      if (asset.profileResource && !excludeProfileResource) {
        resources.push(asset.profileResource)
      }

      return resources
    }, [] as string[])
  }

  function getProfiles(assets: Assets): AssetProfile[] {
    const profiles: AssetProfile[] = []

    for (const asset of assets) {
      if (!asset.profileLibrary) {
        continue
      }

      const assetProfile = get(window, asset.profileLibrary) as AssetProfile

      assetProfile && profiles.push(assetProfile)
    }

    return profiles
  }

  async function loadResources(assets: Assets, document: Document, excludeProfileResource = false): Promise<void> {
    const asyncTasks: Promise<void>[] = []

    function getTask(element: HTMLLinkElement | HTMLScriptElement): Promise<void> {
      return new Promise((resolve, reject) => {
        element.addEventListener('load', () => {
          resolve(undefined)
        })

        element.addEventListener('error', () => {
          reject()
        })
      })
    }

    async function loadResource(resource: string) {
      let element: HTMLLinkElement | HTMLScriptElement

      if (resource.endsWith('.css')) {
        element = document.createElement('link')
        element.rel = 'stylesheet'
        element.href = resource
        document.head.append(element)
        asyncTasks.push(getTask(element))
      } else {
        element = document.createElement('script')
        element.src = resource
        document.body.append(element)

        await getTask(element)
      }
    }

    for (const asset of assets) {
      if (asset.additionResources) {
        for (const resource of asset.additionResources) {
          await loadResource(resource)
        }
      }

      if (asset.profileResource && !excludeProfileResource) {
        await loadResource(asset.profileResource)
      }
    }

    await Promise.all(asyncTasks)
  }

  function unloadResources(assets: Assets, document: Document) {
    function unloadResource(resource: string) {
      if (resource.endsWith('.css')) {
        const element = document.querySelector(`link[href="${resource}"]`)

        if (element) {
          document.head.removeChild(element)
        }
      } else {
        const element = document.querySelector(`script[src="${resource}"]`)

        if (element) {
          document.body.removeChild(element)
        }
      }
    }

    for (const asset of assets) {
      if (asset.additionResources) {
        for (const resource of asset.additionResources) {
          unloadResource(resource)
        }
      }

      if (asset.profileResource) {
        unloadResource(asset.profileResource)
      }
    }
  }

  function importAssets(assets: Assets): Assets | boolean {
    if (JSON.stringify(_assets) === JSON.stringify(assets)) {
      return false
    }

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

    getProfiles,

    loadResources,

    unloadResources,

    importAssets,

    exportAssets,
  }
}

export default createAssetsManager()
