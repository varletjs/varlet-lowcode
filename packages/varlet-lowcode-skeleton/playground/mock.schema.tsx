import { schemaManager } from '@varlet/lowcode-core'

const { id, vNode } = schemaManager

const v = (name) => ({ id: id(), name, library: 'Varlet' })
const n = (name) => ({ id: id(), name, library: 'naive' })

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

// const props = {
//   style: {
//     marginBottom: '10px',
//   },
//   type: 'primary',
//   onClick: expression('() => { count.value++; }'),
// }
//
// const buttons = Array.from({ length: 4 }, () => {
//   return (
//     <node id={id()} {...v('Button')} props={{ type: 'primary' }}>
//       <t textContent="hello" />
//     </node>
//   )
// })
//
// const button = (
//   <node {...v('Button')} for={4} props={{ type: 'success' }}>
//     <t textContent={expression('count.value')} />
//   </node>
// )

// const spread = {
//   name: 'NDataTable',
//   library: 'naive',
// }

// const props = {
//   style: {
//     marginBottom: '10px',
//   },
//   type: 'primary',
//   onClick: expression('() => { count.value++; }'),
// }

// const buttons = Array.from({ length: 4 }, () => {
//   return (
//     <node id={id()} name="Button" library="Varlet" props={{ type: 'warning' }}>
//       <t textContent="hello" />
//     </node>
//   )
// })

// const schema = (
//   <page id={id()} code={code} css={css}>
//     <node
//       {...n('NDataTable')}
//       props={{
//         columns: [
//           {
//             title: 'No',
//             key: 'no',
//           },
//           {
//             title: 'Title',
//             key: 'title',
//           },
//           {
//             title: 'Action',
//             key: 'actions',
//             render: render(
//               [
//                 <node {...n('NButton')} props={props}>
//                   <t id={id()} textContent={expression('count.value')} />
//                 </node>,
//               ],
//               id()
//             ),
//           },
//         ],
//         data: [
//           { no: 3, title: '搞一下' },
//           { no: 4, title: '搞两下' },
//           { no: 12, title: '搞三下' },
//         ],
//       }}
//     />
//     {buttons}
//     {button}
//   </page>
// )

const schema = (
  <page id={id()} code={code} css={css}>
    <node {...n('NTabs')}>
      <node
        {...n('NTabPane')}
        props={{
          name: 'hi',
          tab: vNode(
            <node {...v('Button')}>
              <t id={id()} textContent="hi" />
            </node>
          ),
        }}
      ></node>
    </node>
    <node {...v('Button')}>
      <t id={id()} textContent="hello" />
    </node>
  </page>
)

console.log(schema)

export default schema
