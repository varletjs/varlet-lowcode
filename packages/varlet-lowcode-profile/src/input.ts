import { AssetProfileMaterial } from '@varlet/lowcode-core'

export default {
  name: 'Input',
  description: 'A varlet input component',
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
