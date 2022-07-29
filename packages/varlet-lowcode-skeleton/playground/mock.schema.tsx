import { schemaManager } from '@varlet/lowcode-core'

const { generateId, createRenderBinding, createExpressionBinding } = schemaManager

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

const schema = (
  <page id={generateId()} code={code} css={css}>
    <node
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
            render: createRenderBinding(
              [
                <node
                  id={generateId()}
                  name="NButton"
                  library="naive"
                  props={{
                    style: {
                      marginBottom: '10px',
                    },
                    type: 'primary',
                    onClick: createExpressionBinding('() => { count.value++; }'),
                  }}
                >
                  <t id={generateId()} textContent={createExpressionBinding('count.value')} />
                </node>,
              ],
              generateId()
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
  </page>
)

export default schema
