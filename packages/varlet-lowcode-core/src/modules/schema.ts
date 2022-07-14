import { isArray, isPlainObject, removeItem } from '@varlet/shared'
import { removeHyphen, removePrivateProperty } from '../shared'
import { v4 as uuid } from 'uuid'

export interface SchemaManager {
  isSchemaPageNode(schemaNode: unknown): schemaNode is SchemaPageNode

  isSchemaTextNode(schemaNode: unknown): schemaNode is SchemaTextNode

  isExpressionBinding(value: unknown): boolean

  isObjectBinding(value: unknown): boolean

  isRenderBinding(value: unknown): boolean

  generateId(): string

  createExpressionBinding(expression: string): SchemaNodeBinding

  createRenderBinding(schemaNodes: SchemaNode[]): SchemaNodeBinding

  visitSchemaNode(schemaNode: SchemaNode, schemaNodeVisitor: SchemaNodeVisitor, schemaNodeSiblings?: SchemaNode[]): void

  cloneSchemaNode<T extends SchemaNode>(schemaNode: T): T

  findSchemaNodeById(schemaNode: SchemaNode, id: SchemaNode['id']): SchemaNode | null

  removeSchemaNodeById(schemaNode: SchemaNode, id: SchemaNode['id']): SchemaNode

  importSchema(schemaPageNode: SchemaPageNode): SchemaPageNode | boolean
  importSchema(schemaPageNode: SchemaPageNode, payload?: any): SchemaPageNode | boolean

  exportSchema(): SchemaPageNode
}

export enum BuiltInSchemaNodeNames {
  PAGE = 'Page',
  TEXT = 'Text',
}

export enum BuiltInSchemaNodeBindingTypes {
  OBJECT_BINDING = 'Object',
  EXPRESSION_BINDING = 'Expression',
  RENDER_BINDING = 'Render',
}

export type SchemaNodeProps = Record<string, SchemaNodeBinding>

export type SchemaNodeBinding = any

export interface SchemaNodeSlot {
  children: (SchemaNode | SchemaTextNode)[]
  _slotProps?: Record<string, any>
}

export interface SchemaNode {
  name: string
  library?: string
  id?: string
  props?: SchemaNodeProps
  slots?: Record<string, SchemaNodeSlot>
  if?: SchemaNodeBinding
  for?: SchemaNodeBinding
  key?: SchemaNodeBinding
  models?: string[]
  _item?: Record<string, any>
  _index?: Record<string, any>
  _slotProps?: Record<string, any>
  _renderArgs?: Record<string, any[]>
}

export interface SchemaTextNode extends SchemaNode {
  name: BuiltInSchemaNodeNames.TEXT
  textContent: SchemaNodeBinding
}

export type SchemaPageNodeSetupReturnDeclarations = Record<string, string[]>

export type SchemaPageNodeDataSourceMethod =
  | 'get'
  | 'getBlob'
  | 'getDocument'
  | 'getText'
  | 'getArrayBuffer'
  | 'getStream'
  | 'head'
  | 'headBlob'
  | 'headDocument'
  | 'headText'
  | 'headArrayBuffer'
  | 'headStream'
  | 'options'
  | 'optionsBlob'
  | 'optionsDocument'
  | 'optionsText'
  | 'optionsArrayBuffer'
  | 'optionsStream'
  | 'delete'
  | 'deleteBlob'
  | 'deleteDocument'
  | 'deleteText'
  | 'deleteArrayBuffer'
  | 'deleteStream'
  | 'post'
  | 'postJSON'
  | 'postMultipart'
  | 'put'
  | 'putJSON'
  | 'putMultipart'
  | 'patch'
  | 'patchJSON'
  | 'patchMultipart'

export interface SchemaPageNodeDataSource {
  name: string
  url: string
  method: SchemaPageNodeDataSourceMethod
  description?: string
  headers?: Record<string, string>
  timeout?: number
  withCredentials?: boolean
  successHandler?: SchemaNodeBinding
  errorHandler?: SchemaNodeBinding
}

export interface SchemaPageNode extends SchemaNode {
  name: BuiltInSchemaNodeNames.PAGE
  setupReturnDeclarations?: SchemaPageNodeSetupReturnDeclarations
  code?: string
  compatibleCode?: string
  css?: string
  dataSources?: SchemaPageNodeDataSource[]
}

export type SchemaNodeVisitor = (schemaNode: SchemaNode, schemaNodeSiblings: SchemaNode[] | null) => boolean | void

export function createSchemaManager(): SchemaManager {
  let _schema: SchemaPageNode = {
    id: uuid(),
    name: BuiltInSchemaNodeNames.PAGE,
  }

  function isSchemaPageNode(schemaNode: unknown): schemaNode is SchemaPageNode {
    return (schemaNode as SchemaPageNode).name === BuiltInSchemaNodeNames.PAGE
  }

  function isSchemaTextNode(schemaNode: unknown): schemaNode is SchemaTextNode {
    return (schemaNode as SchemaTextNode).name === BuiltInSchemaNodeNames.TEXT
  }

  function isExpressionBinding(value: unknown): boolean {
    return isPlainObject(value) && value.type === BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING
  }

  function isObjectBinding(value: unknown): boolean {
    return isPlainObject(value) && !isExpressionBinding(value) && !isRenderBinding(value)
  }

  function isRenderBinding(value: unknown): boolean {
    return isPlainObject(value) && value.type === BuiltInSchemaNodeBindingTypes.RENDER_BINDING && value.renderId
  }

  function generateId() {
    return removeHyphen(uuid())
  }

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

  function createExpressionBinding(expression: string, compatibleExpression?: string): SchemaNodeBinding {
    return {
      type: BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING,
      value: expression,
      compatibleValue: compatibleExpression,
    }
  }

  function createRenderBinding(schemaNodes: SchemaNode[]): SchemaNodeBinding {
    return {
      type: BuiltInSchemaNodeBindingTypes.RENDER_BINDING,
      renderId: generateId(),
      value: schemaNodes,
    }
  }

  function importSchema(schema: SchemaPageNode): SchemaPageNode | boolean {
    const newSchema = normalizedSchemaNode(cloneSchemaNode(schema))

    if (JSON.stringify(newSchema) === JSON.stringify(_schema)) {
      return false
    }

    _schema = normalizedSchemaNode(cloneSchemaNode(schema))

    return _schema
  }

  function exportSchema(): SchemaPageNode {
    return cloneSchemaNode(_schema)
  }

  return {
    generateId,

    isSchemaPageNode,
    isSchemaTextNode,

    isExpressionBinding,
    isObjectBinding,
    isRenderBinding,

    createExpressionBinding,
    createRenderBinding,

    cloneSchemaNode,
    visitSchemaNode,
    findSchemaNodeById,
    removeSchemaNodeById,

    importSchema,
    exportSchema,
  }
}

export default createSchemaManager()
