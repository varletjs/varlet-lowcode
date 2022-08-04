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
  props: [
    {
      name: 'type',
      label: '类型',
      setters: [
        {
          setter: 'SelectSetter',
          props: {
            option: [
              {
                value: 'default',
                label: 'default',
              },
              {
                value: 'primary',
                label: 'primary',
              },
              {
                value: 'info',
                label: 'info',
              },
              {
                value: 'success',
                label: 'success',
              },
              {
                value: 'warning',
                label: 'warning',
              },
              {
                value: 'danger',
                label: 'danger',
              },
            ],
            defaultValue: 'default',
          },
        },
      ],
    },
    {
      name: 'size',
      label: '尺寸',
      setters: [
        {
          setter: 'SelectSetter',
          props: {
            option: [
              {
                value: 'normal',
                label: 'normal',
              },
              {
                value: 'mini',
                label: 'mini',
              },
              {
                value: 'small',
                label: 'small',
              },
              {
                value: 'large',
                label: 'large',
              },
            ],
            defaultValue: 'normal',
          },
        },
      ],
    },
    {
      name: 'loading',
      label: '加载状态',
      setters: [
        {
          setter: 'SwitchSetter',
          props: {
            defaultValue: false,
          },
        },
      ],
    },
    {
      name: 'loadingType',
      label: 'loading类型',
      setters: [
        {
          setter: 'SelectSetter',
          props: {
            option: [
              {
                value: 'circle',
                label: 'circle',
              },
              {
                value: 'wave',
                label: 'wave',
              },
              {
                value: 'cube',
                label: 'cube',
              },
              {
                value: 'rect',
                label: 'rect',
              },
              {
                value: 'disappear',
                label: 'disappear',
              },
            ],
            defaultValue: 'circle',
          },
        },
      ],
    },
    {
      name: 'loadingRadius',
      label: 'loading半径',
      setters: [
        {
          setter: 'InputSetter',
          visible: (values: any) => {
            return values.loadingType === 'circle'
          },
          props: {
            defaultValue: '12',
          },
        },
      ],
    },
    {
      name: 'loadingSize',
      label: 'loading尺寸',
      setters: [
        {
          setter: 'SelectSetter',
          visible: (values: any) => {
            return values.loadingType !== 'circle'
          },
          props: {
            option: [
              {
                value: 'large',
                label: 'large',
              },
              {
                value: 'normal',
                label: 'normal',
              },
              {
                value: 'small',
                label: 'small',
              },
              {
                value: 'mini',
                label: 'mini',
              },
            ],
            defaultValue: 'normal',
          },
        },
      ],
    },
    {
      name: 'autoLoading',
      label: '自动加载',
      setters: [
        {
          setter: 'SwitchSetter',
          props: {
            defaultValue: false,
          },
        },
      ],
    },
    {
      name: 'round',
      label: '圆形按钮',
      setters: [
        {
          setter: 'SwitchSetter',
          props: {
            defaultValue: false,
          },
        },
      ],
    },
    {
      name: 'block',
      label: '块级元素',
      setters: [
        {
          setter: 'SwitchSetter',
          props: {
            defaultValue: false,
          },
        },
      ],
    },
    {
      name: 'text',
      label: '文字按钮',
      setters: [
        {
          setter: 'SwitchSetter',
          props: {
            defaultValue: false,
          },
        },
      ],
    },
    {
      name: 'outline',
      label: '外边框',
      setters: [
        {
          setter: 'SwitchSetter',
          props: {
            defaultValue: false,
          },
        },
      ],
    },
    {
      name: 'disabled',
      label: '禁用状态',
      setters: [
        {
          setter: 'SwitchSetter',
          props: {
            defaultValue: false,
          },
        },
      ],
    },
    {
      name: 'ripple',
      label: '水波纹',
      setters: [
        {
          setter: 'SwitchSetter',
          props: {
            defaultValue: true,
          },
        },
      ],
    },
    {
      name: 'onClick',
      label: '点击事件',
      setters: [],
    },
    {
      name: 'onTouchstart',
      label: '触摸手指压下事件',
      setters: [],
    },
  ],
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
