import { isArray, isPlainObject, removeItem, removePrivateProperty } from '../shared'

export interface SchemaManager {
  createExpressionBinding(expression: string): SchemaNodeBinding

  createObjectBinding(record: Record<string, any>): SchemaNodeBinding

  visitSchemaNode(schemaNode: SchemaNode, schemaNodeVisitor: SchemaNodeVisitor, schemaNodeSiblings?: SchemaNode[]): void

  cloneSchemaNode<T extends SchemaNode>(schemaNode: T): T

  findSchemaNodeById(schemaNode: SchemaNode, id: SchemaNode['id']): SchemaNode | null

  removeSchemaNodeById(schemaNode: SchemaNode, id: SchemaNode['id']): SchemaNode

  importSchema(schemaPageNode: SchemaPageNode): SchemaPageNode

  exportSchema(): SchemaPageNode
}

export enum BuiltInSchemaNodeNames {
  PAGE = 'Page',
  TEXT = 'Text',
}

export enum BuiltInSchemaNodeBindingTypes {
  OBJECT_BINDING = 'Object',
  EXPRESSION_BINDING = 'Expression',
}

export type SchemaNodeProps = Record<string, SchemaNodeBinding>

export type SchemaNodeBinding = any

export interface SchemaNodeSlot {
  children?: (SchemaNode | SchemaTextNode)[]
  _slotProps?: Record<string, any>
}

export interface SchemaNode {
  id: string
  name: string
  props?: SchemaNodeProps
  slots?: Record<string, SchemaNodeSlot>
  if?: SchemaNodeBinding
  for?: SchemaNodeBinding
  _item?: Record<string, any>
  _index?: Record<string, any>
  _slotProps?: Record<string, any>
}

export interface SchemaTextNode extends SchemaNode {
  name: BuiltInSchemaNodeNames.TEXT
  textContent: SchemaNodeBinding
}

export interface SchemaPageNode extends SchemaNode {
  name: BuiltInSchemaNodeNames.PAGE
  functions?: string[]
  variables?: string[]
  code?: string
}

export type SchemaNodeVisitor = (schemaNode: SchemaNode, schemaNodeSiblings: SchemaNode[] | null) => boolean | void

export function createSchemaManager(): SchemaManager {
  let _schema: SchemaPageNode

  function cloneSchemaNode<T extends SchemaNode>(schemaNode: T): T {
    return JSON.parse(JSON.stringify(schemaNode))
  }

  function visitSchemaNode(schemaNode: SchemaNode, visitor: SchemaNodeVisitor, schemaNodeSiblings?: SchemaNode[]) {
    const stop = visitor(schemaNode, schemaNodeSiblings ?? null)

    if (stop) {
      return
    }

    if (isPlainObject(schemaNode.slots)) {
      for (const slot of Object.values(schemaNode.slots)) {
        if (isArray(slot.children) && slot.children.length > 0) {
          for (const schemaNodeChild of slot.children) {
            visitSchemaNode(schemaNodeChild, visitor, slot.children)
          }
        }
      }
    }
  }

  function findSchemaNodeById(schemaNode: SchemaNode, id: SchemaNode['id']): SchemaNode | null {
    let founded = null

    visitSchemaNode(schemaNode, (schemaNode) => {
      if (schemaNode.id === id) {
        founded = schemaNode
        return true
      }
    })

    return founded
  }

  function removeSchemaNodeById(schemaNode: SchemaNode, id: SchemaNode['id']): SchemaNode {
    if (schemaNode.id === id) {
      throw new Error('Cannot delete itself')
    }

    visitSchemaNode(schemaNode, (schemaNode, schemaNodeSiblings) => {
      if (schemaNode.id === id) {
        removeItem(schemaNodeSiblings!, schemaNode)
        return true
      }
    })

    return schemaNode
  }

  function normalizedSchemaNode<T extends SchemaNode>(schemaNode: T): T {
    visitSchemaNode(schemaNode, (schemaNode) => {
      removePrivateProperty(schemaNode)

      if (isPlainObject(schemaNode.slots)) {
        for (const slot of Object.values(schemaNode.slots)) {
          removePrivateProperty(slot)
        }
      }
    })

    return schemaNode
  }

  function createExpressionBinding(expression: string): SchemaNodeBinding {
    return {
      type: BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING,
      value: expression,
    }
  }

  function createObjectBinding(record: Record<string, any>): SchemaNodeBinding {
    return {
      type: BuiltInSchemaNodeBindingTypes.OBJECT_BINDING,
      value: record,
    }
  }

  function importSchema(schema: SchemaPageNode): SchemaPageNode {
    _schema = normalizedSchemaNode(cloneSchemaNode(schema))

    return _schema
  }

  function exportSchema(): SchemaPageNode {
    return cloneSchemaNode(_schema)
  }

  return {
    createExpressionBinding,

    createObjectBinding,

    cloneSchemaNode,

    visitSchemaNode,

    findSchemaNodeById,

    removeSchemaNodeById,

    importSchema,

    exportSchema,
  }
}

export default createSchemaManager()
