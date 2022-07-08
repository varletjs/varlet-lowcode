import type { AssetProfileMaterial } from '@varlet/lowcode-core'

export default {
  name: 'Dialog.Component',
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
