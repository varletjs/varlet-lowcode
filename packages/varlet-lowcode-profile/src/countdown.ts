import type { AssetProfileMaterial } from '@varlet/lowcode-core'

export default {
  name: 'Countdown',
  slots: [
    {
      name: 'default',
      hasSlotProps: true,
    },
  ],
  codegen: {
    name: 'var-countdown',
  },
} as AssetProfileMaterial
