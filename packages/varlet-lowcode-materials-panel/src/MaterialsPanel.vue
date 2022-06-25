<template>
  <div>materials</div>
</template>
<script setup lang="ts">
import type { AssetsManager } from '@varlet/lowcode-core'
import { assetsManager, BuiltInEvents, eventsManager } from '@varlet/lowcode-core'

const getRendererWindow = () => Array.from(window).find((w) => w.name === 'rendererWindow') as any

const getRendererAssetsManager = (): AssetsManager => {
  return getRendererWindow().VarletLowcodeCore.assetsManager
}
let assets = assetsManager.exportAssets()

eventsManager.on(BuiltInEvents.ASSETS_CHANGE, async (newAssets) => {
  assets = newAssets
})

setTimeout(() => {
  console.log(getRendererAssetsManager().getProfiles(assets))
}, 3000)
</script>
