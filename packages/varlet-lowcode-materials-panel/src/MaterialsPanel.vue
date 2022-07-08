<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'
import { Space as VarSpace, Icon as VarIcon } from '@varlet/ui'
import '@varlet/ui/es/space/style/index'
import '@varlet/ui/es/icon/style/index'
import { AssetProfile, Assets, assetsManager, BuiltInEvents, eventsManager } from '@varlet/lowcode-core'
import type { Ref } from 'vue'
import type { AssetsManager, AssetProfileMaterialSnapshot } from '@varlet/lowcode-core'

let assets = assetsManager.exportAssets()

const profiles: Ref<AssetProfile[]> = ref([])
const snapshots: Ref<AssetProfileMaterialSnapshot[]> = ref([])
const snapshotToMaterial = new WeakMap()

watch(
  () => profiles.value,
  (newProfiles) => {
    const newSnapshots: AssetProfileMaterialSnapshot[] = []

    newProfiles.forEach((profile) => {
      ;(profile.materials ?? []).forEach((material) => {
        ;(material.snapshots ?? []).forEach((snapshot) => {
          snapshotToMaterial.set(snapshot, material)
          newSnapshots.push(snapshot)
        })
      })
    })

    snapshots.value = newSnapshots
  }
)

function getProfiles(assets: Assets) {
  const rendererWindow = Array.from(window).find((w) => w.name === 'rendererWindow') as any
  const rendererAssetsManager = rendererWindow?.VarletLowcodeCore?.assetsManager as AssetsManager | undefined

  if (!rendererAssetsManager) {
    return []
  }

  return rendererAssetsManager.getProfiles(assets)
}

if (assets) {
  profiles.value = getProfiles(assets)
}

function handleSkeletonLoaded(loader: any) {
  if (loader !== 'designer') {
    return
  }

  profiles.value = getProfiles(assets)
}

eventsManager.on(BuiltInEvents.ASSETS_CHANGE, async (newAssets) => {
  assets = newAssets
})

eventsManager.on('skeleton-loaded', handleSkeletonLoaded)

onUnmounted(() => {
  eventsManager.off('skeleton-sidebar-toggle', handleSkeletonLoaded)
})
</script>

<template>
  <div class="varlet-low-code-materials-panel">
    <var-space :size="[18, 18]">
      <div class="varlet-low-code-materials-panel__snapshot" v-for="(snapshot, index) in snapshots" :key="index">
        <img class="varlet-low-code-materials-panel__image" :src="snapshot.image" v-if="snapshot.image" />
        <var-icon name="image-outline" :size="30" v-else />

        <div class="varlet-low-code-materials-panel__label">{{ snapshot.label ?? '暂无名称' }}</div>
      </div>
    </var-space>
  </div>
</template>

<style lang="less">
.varlet-low-code-materials-panel {
  width: 300px;
  padding: 20px 0 20px 20px;

  &__snapshot {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 81px;
    height: 81px;
    color: #888;
    background: #fff;
    border: thin solid #eee;
    transition: background-color 0.2s;
    border-radius: 2px;

    &:hover {
      cursor: pointer;
      background: #eee;
    }
  }

  &__image {
    width: 30px;
    height: 30px;
    object-fit: contain;
  }

  &__label {
    margin-top: 6px;
    font-size: 13px;
  }
}
</style>
