import { AssetProfileMaterial } from '@varlet/lowcode-core'

export default {
  name: 'Input',
  slots: [
    {
      name: 'prepend-icon',
    },
    {
      name: 'append-icon',
    },
  ],
  codegen: {
    name: 'var-input',
  },
} as AssetProfileMaterial
