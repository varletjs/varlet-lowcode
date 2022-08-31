import { schemaManager } from '@varlet/lowcode-core'

const { id } = schemaManager

const code = `\
function setup() {
  const count = ref(1)
  const doubleCount = computed(() => count.value * 2)

  const handleClick = () => {
    count.value++
  }

  return {
    count,
    doubleCount,
    handleClick,
  }
}
`
const css = 'body {\n  padding: 20px\n}'

const schema = (
  <page id={id()} code={code} css={css}>
    <node id={id()} library={'Varlet'} name={'Button'}>
      <t id={id()} textContent={'BUTTON 1'} />
    </node>
    <node id={id()} library={'Varlet'} name={'Button'}>
      <t id={id()} textContent={'BUTTON 2'} />
    </node>
  </page>
)

export default schema
