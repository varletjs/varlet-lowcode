const styleMaterials = [
  {
    name: 'style:type',
    label: '状态',
    defaultValue: 'default',
    setters: [
      {
        setter: 'SelectSetter',
        props: {
          options: [
            {
              value: '默认状态',
              label: 'default',
            },
            {
              value: ':hover',
              label: ':hover',
            },
            {
              value: ':focus',
              label: ':focus',
            },
            {
              value: ':active',
              label: ':active',
            },
          ],
        },
      },
    ],
  },
  {
    name: 'style:width',
    label: '宽',
    defaultValue: '350px',
    setters: [
      {
        setter: 'InputSetter',
      },
    ],
  },
  {
    name: 'style:height',
    label: '高',
    defaultValue: '350px',
    setters: [
      {
        setter: 'InputSetter',
      },
    ],
  },
  {
    name: 'style:display',
    label: '显示',
    defaultValue: 'block',
    setters: [
      {
        setter: 'SelectSetter',
        props: {
          options: [
            {
              value: 'block',
              label: 'block',
            },
            {
              value: 'inline-block',
              label: 'inline-block',
            },
            {
              value: 'inline',
              label: 'inline',
            },
            {
              value: 'flex',
              label: 'flex',
            },
          ],
        },
      },
    ],
  },
  {
    name: 'style:flex-direction',
    label: '方向',
    defaultValue: 'row',
    visible: (values: any) => {
      return values.display === 'flex'
    },
    setters: [
      {
        setter: 'SelectSetter',
        props: {
          options: [
            {
              value: 'Direction:row',
              label: 'row',
            },
            {
              value: 'Direction:column',
              label: 'column',
            },
            {
              value: 'Direction:row-reverse',
              label: 'row-reverse',
            },
            {
              value: 'Direction:column-reverse',
              label: 'column-reverse',
            },
          ],
        },
      },
    ],
  },
  {
    name: 'style:align-items',
    label: '上下',
    defaultValue: 'center',
    visible: (values: any) => {
      return values.display === 'flex'
    },
    setters: [
      {
        setter: 'SelectSetter',
        props: {
          options: [
            {
              value: 'Align:flex-start',
              label: 'flex-start',
            },
            {
              value: 'Align:center',
              label: 'center',
            },
            {
              value: 'Align:flex-end',
              label: 'flex-end',
            },
            {
              value: 'Align:stretch',
              label: 'stretch',
            },
            {
              value: 'Align:baseline',
              label: 'baseline',
            },
          ],
        },
      },
    ],
  },
  {
    name: 'style:justify-content',
    label: '左右',
    defaultValue: 'center',
    visible: (values: any) => {
      return values.display === 'flex'
    },
    setters: [
      {
        setter: 'SelectSetter',
        props: {
          options: [
            {
              value: 'Justify:flex-start',
              label: 'flex-start',
            },
            {
              value: 'Justify:center',
              label: 'center',
            },
            {
              value: 'Justify:flex-end',
              label: 'flex-end',
            },
            {
              value: 'Justify:space-between',
              label: 'space-between',
            },
            {
              value: 'Justify:space-around',
              label: 'space-around',
            },
          ],
        },
      },
    ],
  },
  {
    name: 'style:margin-top',
    label: `上间距`,
    defaultValue: '0px',
    setters: [
      {
        setter: 'InputSetter',
      },
    ],
  },
  {
    name: 'style:margin-bottom',
    label: '下间距',
    defaultValue: '0px',
    setters: [
      {
        setter: 'InputSetter',
      },
    ],
  },
  {
    name: 'style:margin-left',
    label: '左间距',
    defaultValue: '0px',
    setters: [
      {
        setter: 'InputSetter',
      },
    ],
  },
  {
    name: 'style:margin-right',
    label: '右间距',
    defaultValue: '0px',
    setters: [
      {
        setter: 'InputSetter',
      },
    ],
  },
  {
    name: 'style:margin-right',
    label: 'padding',
    defaultValue: '0px',
    setters: [
      {
        setter: 'MarginSetter',
      },
    ],
  },
  {
    name: 'style:padding-top',
    label: `上间距`,
    defaultValue: '0px',
    setters: [
      {
        setter: 'InputSetter',
      },
    ],
  },
  {
    name: 'style:padding-bottom',
    label: '下间距',
    defaultValue: '0px',
    setters: [
      {
        setter: 'InputSetter',
      },
    ],
  },
  {
    name: 'style:padding-left',
    label: '左间距',
    defaultValue: '0px',
    setters: [
      {
        setter: 'InputSetter',
      },
    ],
  },
  {
    name: 'style:padding-right',
    label: '右间距',
    defaultValue: '0px',
    setters: [
      {
        setter: 'InputSetter',
      },
    ],
  },
]

export default styleMaterials
