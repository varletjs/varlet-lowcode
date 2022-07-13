import { BuiltInSchemaNodeNames } from '@varlet/lowcode-core'
import type { AssetProfileMaterial, AssetProfileMaterialSnapshot } from '@varlet/lowcode-core'
import type { ButtonProps } from '@varlet/ui'

function createTypeButton(type: ButtonProps['type'], label: string): AssetProfileMaterialSnapshot {
  return {
    label,
    schemas: [
      {
        name: 'Button',
        library: 'Varlet',
        props: {
          type,
        },
        slots: {
          default: {
            children: [
              {
                name: BuiltInSchemaNodeNames.TEXT,
                textContent: label,
              },
            ],
          },
        },
      },
    ],
  }
}

const material: AssetProfileMaterial = {
  name: 'Button',
  slots: [
    {
      name: 'default',
    },
  ],
  codegen: {
    name: 'var-button',
  },
  snapshots: [
    createTypeButton('default', '默认按钮'),
    createTypeButton('primary', '主要按钮'),
    createTypeButton('info', '信息按钮'),
    createTypeButton('success', '成功按钮'),
    createTypeButton('warning', '警告按钮'),
    createTypeButton('danger', '危险按钮'),
  ],
}

export default material
