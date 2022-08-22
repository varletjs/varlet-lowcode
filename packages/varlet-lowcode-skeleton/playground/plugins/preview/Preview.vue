<script lang="ts" setup>
import { Button as VarButton } from '@varlet/ui'
import '@varlet/ui/es/button/style/index.js'
import { assetsManager, schemaManager } from '@varlet/lowcode-core'

function preview() {
  const schema = schemaManager.exportSchema()
  const assets = assetsManager.exportAssets()

  localStorage.setItem(
    'preview-meta-data',
    JSON.stringify({
      schema,
      assets,
    })
  )

  console.log({
    schema,
    assets,
  })

  location.href = '/preview/index.html'
}
</script>

<template>
  <var-button type="primary" @click="preview">预览</var-button>
</template>
