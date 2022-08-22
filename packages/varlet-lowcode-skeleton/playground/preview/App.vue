<script lang="ts" setup>
import { default as Renderer } from '@varlet/lowcode-renderer'
import { onMounted, ref } from 'vue'
import { assetsManager } from '@varlet/lowcode-core'
import type { Assets, SchemaPageNode } from '@varlet/lowcode-core'
import type { Ref } from 'vue'

const schema: Ref<SchemaPageNode> = ref(null)
const assets: Ref<Assets> = ref(null)

interface PreviewMetaData {
  schema: SchemaPageNode
  assets: Assets
}

onMounted(async () => {
  const cached = localStorage.getItem('preview-meta-data')
  if (!cached) {
    return
  }

  const previewMetaData = JSON.parse(cached) as PreviewMetaData

  await assetsManager.loadResources(previewMetaData.assets, document)

  schema.value = previewMetaData.schema
  assets.value = previewMetaData.assets
})
</script>

<template>
  <renderer v-if="schema && assets" :schema="schema" :assets="assets" />
</template>
