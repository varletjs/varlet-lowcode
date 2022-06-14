import type { AssetProfileMaterial } from '@varlet/lowcode-core'

export default {
  name: 'Dialog.Component',
  description: 'A varlet dialog component',
  slots: [
    {
      name: 'default',
    },
    {
      name: 'title',
    },
  ],
  codegen: {
    name: 'var-dialog',
  },
} as AssetProfileMaterial
