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

  createExpressionBinding(expression: string, compatibleExpression?: string): SchemaNodeBinding
  createRenderBinding(schemaNodes: SchemaNode[], renderId?: string): SchemaNodeBinding

  visitRenderSchemaNode(record: Record<string, any>, schemaNodeVisitor: SchemaNodeVisitor): void | boolean
  visitSchemaNode(schemaNode: SchemaNode, schemaNodeVisitor: SchemaNodeVisitor): void
  cloneSchemaNode<T extends SchemaNode>(schemaNode: T): T

  addSchemaNode(schemaNode: SchemaNode, parentId: SchemaNode['id'], slotsName?: string): SchemaNode
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

export enum SchemaNodePlaces {
  TREE = 'Tree',
  RENDER_FUNCTION_ROOT = 'RenderFunctionRoot',
}

export interface SchemaNodeSlot {
  children: (SchemaNode | SchemaTextNode)[]
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

export type SchemaNodeVisitor = (
  schemaNode: SchemaNode,
  schemaNodeSiblings: SchemaNode[] | null,
  schemaNodePlace: SchemaNodePlaces,
  renderBinding?: SchemaNodeBinding
) => boolean | void

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

  function visitRenderSchemaNode(record: Record<string, any> | any[], visitor: SchemaNodeVisitor): boolean | void {
    for (const value of Object.values(record)) {
      if (isRenderBinding(value)) {
        for (const schemaNode of value.value) {
          if (visitor(schemaNode, value.value, SchemaNodePlaces.RENDER_FUNCTION_ROOT, value)) {
            return true
          }

          visitSchemaNode(schemaNode, visitor)
        }
      }

      if (isObjectBinding(value) || isArray(value)) {
        if (visitRenderSchemaNode(value, visitor)) {
          return true
        }
      }
    }
  }

  function visitSchemaNode(schemaNode: SchemaNode, visitor: SchemaNodeVisitor) {
    if (isPlainObject(schemaNode.props)) {
      if (visitRenderSchemaNode(schemaNode.props, visitor)) {
        return
      }
    }

    if (isPlainObject(schemaNode.slots)) {
      for (const slot of Object.values(schemaNode.slots)) {
        if (isArray(slot.children) && slot.children.length > 0) {
          for (const schemaNodeChild of slot.children) {
            if (visitor(schemaNodeChild, slot.children, SchemaNodePlaces.TREE)) {
              return
            }

            visitSchemaNode(schemaNodeChild, visitor)
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

  function addSchemaNode(schemaNode: SchemaNode, parentId: SchemaNode['id'], slotsName = 'default'): SchemaNode {
    const rootSchemaNode = cloneSchemaNode(_schema)
    const { id } = schemaNode

    visitSchemaNode(rootSchemaNode, (_schemaNode) => {
      if (_schemaNode.id === id) {
        throw new Error("SchemaNode already added. The schema's id is repeatedly")
      }

      if (_schemaNode.id === parentId) {
        _schemaNode.slots![slotsName].children!.push(schemaNode)
        return true
      }
    })

    return rootSchemaNode
  }

  function removeSchemaNodeById(schemaNode: SchemaNode, id: SchemaNode['id']): SchemaNode {
    visitSchemaNode(schemaNode, (schemaNode, schemaNodeSiblings) => {
      if (schemaNode.id === id) {
        removeItem(schemaNodeSiblings!, schemaNode)
        return true
      }
    })

    return schemaNode
  }

  function normalizeSchemaNode<T extends SchemaNode>(schemaNode: T): T {
    removePrivateProperty(schemaNode)

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

  function createRenderBinding(schemaNodes: SchemaNode[], renderId?: string): SchemaNodeBinding {
    return {
      type: BuiltInSchemaNodeBindingTypes.RENDER_BINDING,
      renderId: renderId ?? generateId(),
      value: schemaNodes,
    }
  }

  function importSchema(schema: SchemaPageNode): SchemaPageNode | boolean {
    const newSchema = normalizeSchemaNode(cloneSchemaNode(schema))

    if (JSON.stringify(newSchema) === JSON.stringify(_schema)) {
      return false
    }

    _schema = normalizeSchemaNode(cloneSchemaNode(schema))

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

    visitRenderSchemaNode,
    visitSchemaNode,

    addSchemaNode,
    cloneSchemaNode,
    findSchemaNodeById,
    removeSchemaNodeById,

    importSchema,
    exportSchema,
  }
}

export default createSchemaManager()
