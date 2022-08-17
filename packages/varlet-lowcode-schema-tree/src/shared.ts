import { SchemaNode, SchemaNodeProps, SchemaNodeSlots, SchemaTextNode } from '@varlet/lowcode-core'
import { isArray, isPlainObject } from '@varlet/shared'

export interface Tree {
  renderType: string
  type: string
  id: string
  tag: string
  children?: Array<Tree>
}

export type Data = (SchemaNode & SchemaNodeProps & SchemaNodeSlots & SchemaTextNode) | SchemaNodeProps | SchemaNodeSlots

const transformSlots = (slots: SchemaNode['slots']) => {
  if (!slots) return []

  return Object.entries(slots)
    .map((slot) => slot[1].children.map((slotChild) => transform(slotChild, `Slot-${slot[0]}`)))
    .reduce((pre, cur) => pre.concat(cur), [])
}

const transformProps = (props: SchemaNode['props'], children: Array<Tree> = []) => {
  if (!isArray(props) && !isPlainObject(props)) return

  if (isArray(props)) {
    props.forEach((value) => transformProps(value, children))
  }

  if (isPlainObject(props)) {
    if (props.type === 'Render') {
      children.push(transform(props, 'Render-props'))
    } else {
      Object.keys(props).forEach((key) => {
        transformProps(props[key], children)
      })
    }
  }

  return children.reduce((pre, cur) => pre.concat(cur), [] as Array<Tree>)
}

export const transform = (
  data: Data,
  renderType = 'root',
  tree: Tree = { renderType, type: 'Node', id: data.id, tag: data.name }
): Tree => {
  if (!isPlainObject(data)) {
    throw Error('[varlet-lowcode-schema-tree]: data is not object')
  }

  const isRender = data.type && data.value
  const isSlots = !!data.slots
  const isProps = !!data.props
  const isText = data.name === 'Text' && data.textContent !== undefined && data.textContent !== null

  if (isRender) {
    return data.value.map((node: Data) => transform(node, renderType))
  }

  if (isSlots) {
    tree.children = transformSlots(data.slots)
  }

  if (isProps) {
    const renderPropsNodes = transformProps(data.props)

    if (renderPropsNodes?.length) {
      tree.children = tree.children ? [...tree.children, ...renderPropsNodes] : renderPropsNodes
    }
  }

  if (isText) {
    tree.type = 'TextNode'
    tree.tag = 'Text'
  }

  return tree
}
