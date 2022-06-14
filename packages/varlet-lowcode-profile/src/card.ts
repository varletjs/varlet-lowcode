import type { AssetProfileMaterial } from '@varlet/lowcode-core'

export default {
  name: 'Card',
  description: 'A varlet card component',
  slots: [
    {
      name: 'image',
    },
    {
      name: 'title',
    },
    {
      name: 'subtitle',
    },
    {
      name: 'description',
    },
    {
      name: 'content',
    },
    {
      name: 'extra',
    },
    {
      name: 'close-button',
    },
  ],
  codegen: {
    name: 'var-card',
  },
} as AssetProfileMaterial
