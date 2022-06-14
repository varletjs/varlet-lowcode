import type { AssetProfileMaterial } from '@varlet/lowcode-core'

export default {
  name: 'Button',
  description: 'A varlet button component',
  slots: [
    {
      name: 'default',
    },
  ],
  codegen: {
    name: 'var-button',
  },
} as AssetProfileMaterial
