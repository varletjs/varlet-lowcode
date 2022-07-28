import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import generate from '@babel/generator'

enum Tags {
  PAGE_TAG = 'page',
  NODE_TAG = 'node',
  TEXT_TAG = 't',
  SLOT_TAG = 'slot',
}

const TagNames: Record<Tags, string> = {
  [Tags.PAGE_TAG]: 'Page',
  [Tags.TEXT_TAG]: 'Text',
  [Tags.NODE_TAG]: '',
  [Tags.SLOT_TAG]: '',
}

function getTag(node: t.JSXElement) {
  if (!t.isJSXIdentifier(node.openingElement.name)) {
    return
  }

  if (![Tags.PAGE_TAG, Tags.TEXT_TAG, Tags.SLOT_TAG, Tags.NODE_TAG].includes(node.openingElement.name.name as any)) {
    return
  }

  return node.openingElement.name.name as Tags
}

function getProperties(node: t.JSXElement) {
  const tag = getTag(node)
  const properties: t.ObjectProperty[] = []

  if (!tag || tag === Tags.SLOT_TAG) {
    return []
  }

  if (tag === Tags.TEXT_TAG || tag === Tags.PAGE_TAG) {
    properties.push(t.objectProperty(t.identifier('name'), t.stringLiteral(TagNames[tag])))
  }

  if (tag === Tags.NODE_TAG || tag === Tags.TEXT_TAG || tag === Tags.PAGE_TAG) {
    for (const attribute of node.openingElement.attributes) {
      // prop="Button"
      if (t.isJSXAttribute(attribute) && t.isJSXIdentifier(attribute.name) && t.isStringLiteral(attribute.value)) {
        properties.push(t.objectProperty(t.identifier(attribute.name.name), t.stringLiteral(attribute.value.value)))
      }

      // prop={}
      if (
        t.isJSXAttribute(attribute) &&
        t.isJSXIdentifier(attribute.name) &&
        t.isJSXExpressionContainer(attribute.value) &&
        !t.isJSXEmptyExpression(attribute.value.expression)
      ) {
        properties.push(t.objectProperty(t.identifier(attribute.name.name), attribute.value.expression))
      }
    }
  }

  return properties
}

function getSlotName(node: t.JSXElement) {
  for (const attribute of node.openingElement.attributes) {
    if (
      t.isJSXAttribute(attribute) &&
      t.isJSXIdentifier(attribute.name) &&
      t.isStringLiteral(attribute.value) &&
      attribute.name.name === 'name'
    ) {
      return attribute.value.value
    }
  }
}

function transformJSXElement(node: t.JSXElement) {
  const tag = getTag(node)

  if (!tag || tag === Tags.SLOT_TAG) {
    return
  }

  const slots = t.objectExpression([])
  const slotNameToChildren = new Map<string, t.ArrayExpression>()
  const properties: t.ObjectProperty[] = getProperties(node)

  function getChildren(slotName: string) {
    let children = slotNameToChildren.get(slotName)

    if (!children) {
      children = t.arrayExpression([])

      slotNameToChildren.set(slotName, children)

      slots.properties.push(
        t.objectProperty(
          t.identifier(slotName),
          t.objectExpression([t.objectProperty(t.identifier('children'), children)])
        )
      )
    }

    return children
  }

  for (const childNode of node.children) {
    if (t.isJSXElement(childNode)) {
      const tag = getTag(childNode)

      if (!tag) {
        continue
      }

      // <slot>
      if (tag === Tags.SLOT_TAG) {
        const slotNode = childNode
        const slotName = getSlotName(slotNode) ?? 'default'
        const children = getChildren(slotName)

        for (const slotChildNode of slotNode.children) {
          if (t.isJSXElement(slotChildNode)) {
            const objectExpression = transformJSXElement(slotChildNode)

            if (objectExpression) {
              children.elements.push(objectExpression)
            }
          } else if (t.isJSXExpressionContainer(slotChildNode) && !t.isJSXEmptyExpression(slotChildNode.expression)) {
            // { render() }
            children.elements.push(slotChildNode.expression)
          }
        }
      }

      // <page> <node> <text>
      const objectExpression = transformJSXElement(childNode)

      if (objectExpression) {
        getChildren('default').elements.push(objectExpression)
      }
    } else if (t.isJSXExpressionContainer(childNode) && !t.isJSXEmptyExpression(childNode.expression)) {
      // { render() }
      getChildren('default').elements.push(childNode.expression)
    }
  }

  properties.push(t.objectProperty(t.identifier('slots'), slots))

  return t.objectExpression(properties)
}

export function transform(source: string) {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['jsx'],
  })

  traverse(ast, {
    JSXElement(path) {
      if (!t.isJSXIdentifier(path.node.openingElement.name)) {
        return
      }

      const objectExpression = transformJSXElement(path.node)

      if (objectExpression) {
        path.replaceWith(objectExpression)
      }
    },
  })

  return generate(ast).code
}
