import { schemaManager } from '@varlet/lowcode-core'

const { id, render, expression } = schemaManager

const code = `\
function setup() {
  const count = ref(1)
  const doubleCount = computed(() => count.value * 2)

  return {
    count,
    doubleCount,
  }
}
`
const css = 'body {\n  padding: 20px\n}'

const spread = {
  name: 'NDataTable',
  library: 'naive',
}

const props = {
  style: {
    marginBottom: '10px',
  },
  type: 'primary',
  onClick: expression('() => { count.value++; }'),
}

const buttons = Array.from({ length: 4 }, () => {
  return (
    <node id={id()} name="Button" library="Varlet" props={{ type: 'primary' }}>
      <t textContent="hello" />
    </node>
  )
})

const button = (
  <node id={id()} for={4} name="Button" library="Varlet" props={{ type: 'success' }}>
    <t textContent={expression('count.value')} />
  </node>
)

const schema = (
  <page id={id()} code={code} css={css}>
    <node
      id={id()}
      {...spread}
      props={{
        columns: [
          {
            title: 'No',
            key: 'no',
          },
          {
            title: 'Title',
            key: 'title',
          },
          {
            title: 'Action',
            key: 'actions',
            render: render(
              [
                <node id={id()} name="NButton" library="naive" props={props}>
                  <t id={id()} textContent={expression('count.value')} />
                </node>,
              ],
              id()
            ),
          },
        ],
        data: [
          { no: 3, title: '搞一下' },
          { no: 4, title: '搞两下' },
          { no: 12, title: '搞三下' },
        ],
      }}
    />
    {buttons}
    {button}
  </page>
)

console.log(schema)

export default schema
