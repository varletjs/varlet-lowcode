import { isArray, isPlainObject, removeItem } from '@varlet/shared'
import { removeHyphen, removePrivateProperty } from '../shared'
import { v4 as uuid } from 'uuid'

export interface SchemaManager {
  isSchemaPageNode(schemaNode: unknown): schemaNode is SchemaPageNode

  isSchemaTextNode(schemaNode: unknown): schemaNode is SchemaTextNode

  isExpressionBinding(value: unknown): boolean

  isObjectBinding(value: unknown): boolean

  isRenderBinding(value: unknown): boolean

  isVNodeBinding(value: unknown): boolean

  generateId(): string

  createExpressionBinding(expression: string, compatibleExpression?: string): SchemaNodeBinding

  createRenderBinding(schemaNodes: SchemaNode[], renderId?: string): SchemaNodeBinding
  createRenderBinding(schemaNodes: JSX.Element[], renderId?: string): SchemaNodeBinding

  createVNodeBinding(schemaNode: SchemaNode): SchemaNodeBinding
  createVNodeBinding(schemaNode: JSX.Element): SchemaNodeBinding

  visitSchemaNode(schemaNode: SchemaNode, schemaNodeVisitor: SchemaNodeVisitor, include?: SchemaNodeIn[]): void
  visitSchemaNode(schemaNode: JSX.Element, schemaNodeVisitor: SchemaNodeVisitor, include?: SchemaNodeIn[]): void

  cloneSchemaNode<T extends SchemaNode | JSX.Element>(schemaNode: T): T

  findSchemaNodeById(schemaNode: JSX.Element, id: SchemaNode['id']): JSX.Element | null
  findSchemaNodeById(schemaNode: SchemaNode, id: SchemaNode['id']): SchemaNode | null

  removeSchemaNodeById(schemaNode: JSX.Element, id: SchemaNode['id']): JSX.Element
  removeSchemaNodeById(schemaNode: SchemaNode, id: SchemaNode['id']): SchemaNode

  importSchema(schema: JSX.Element): SchemaPageNode | boolean
  importSchema(schema: SchemaPageNode): SchemaPageNode | boolean
  importSchema(schemaPageNode: SchemaPageNode, payload?: any): SchemaPageNode | boolean
  importSchema(schemaPageNode: JSX.Element, payload?: any): SchemaPageNode | boolean

  exportSchema(): SchemaPageNode

  // shorthand
  id(): string
  expression(expression: string, compatibleExpression?: string): SchemaNodeBinding
  render(schemaNodes: SchemaNode[], renderId?: string): SchemaNodeBinding
  render(schemaNodes: JSX.Element[], renderId?: string): SchemaNodeBinding
  vNode(schemaNode: SchemaNode): SchemaNodeBinding
  vNode(schemaNode: JSX.Element): SchemaNodeBinding
  remove(schemaNode: JSX.Element, id: SchemaNode['id']): JSX.Element
  remove(schemaNode: SchemaNode, id: SchemaNode['id']): SchemaNode
  find(schemaNode: JSX.Element, id: SchemaNode['id']): JSX.Element | null
  find(schemaNode: SchemaNode, id: SchemaNode['id']): SchemaNode | null
  visit(schemaNode: SchemaNode, schemaNodeVisitor: SchemaNodeVisitor, include?: SchemaNodeIn[]): void
  visit(schemaNode: JSX.Element, schemaNodeVisitor: SchemaNodeVisitor, include?: SchemaNodeIn[]): void
  clone<T extends SchemaNode | JSX.Element>(schemaNode: T): T
}

export enum BuiltInSchemaNodeNames {
  PAGE = 'Page',
  TEXT = 'Text',
}

export enum BuiltInSchemaNodeBindingTypes {
  EXPRESSION_BINDING = 'Expression',
  RENDER_BINDING = 'Render',
  V_NODE_BINDING = 'VNode',
}

export type SchemaNodeProps = Record<string, SchemaNodeBinding>
export type SchemaNodeSlots = Record<string, SchemaNodeSlot>

export type SchemaNodeBinding = any

export enum SchemaNodeIn {
  SLOTS = 'Slots',
  PROPS = 'Props',
}

export interface SchemaNodeSlot {
  children: (SchemaNode | SchemaTextNode)[]
}

export interface SchemaNode {
  name: string
  library?: string
  id?: string
  props?: SchemaNodeProps
  slots?: SchemaNodeSlots
  if?: SchemaNodeBinding
  for?: SchemaNodeBinding
  models?: string[]
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
  schemaNodeIn: SchemaNodeIn,
  vNodeBinding?: SchemaNodeBinding,
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
    return isPlainObject(value) && !isExpressionBinding(value) && !isRenderBinding(value) && !isVNodeBinding(value)
  }

  function isRenderBinding(value: unknown): boolean {
    return isPlainObject(value) && value.type === BuiltInSchemaNodeBindingTypes.RENDER_BINDING && value.renderId
  }

  function isVNodeBinding(value: unknown): boolean {
    return isPlainObject(value) && value.type === BuiltInSchemaNodeBindingTypes.V_NODE_BINDING
  }

  function generateId() {
    return removeHyphen(uuid())
  }

  function cloneSchemaNode<T extends SchemaNode | JSX.Element>(schemaNode: T): T {
    return JSON.parse(JSON.stringify(schemaNode))
  }

  function visitPropsSchemaNode(
    record: Record<string, any> | any[],
    visitor: SchemaNodeVisitor,
    include: SchemaNodeIn[] = [SchemaNodeIn.SLOTS, SchemaNodeIn.PROPS]
  ): boolean | void {
    for (const value of Object.values(record)) {
      if (isObjectBinding(value) || isArray(value)) {
        if (visitPropsSchemaNode(value, visitor, include)) {
          return true
        }
      }

      if (isVNodeBinding(value)) {
        if (visitor(value.value, [], SchemaNodeIn.PROPS, value, undefined)) {
          return true
        }

        visitSchemaNode(value.value, visitor, include)
      }

      if (isRenderBinding(value)) {
        for (const schemaNode of value.value) {
          if (visitor(schemaNode, value.value, SchemaNodeIn.PROPS, undefined, value)) {
            return true
          }

          visitSchemaNode(schemaNode, visitor, include)
        }
      }
    }
  }

  function visitSchemaNode(schemaNode: JSX.Element, visitor: SchemaNodeVisitor, include?: SchemaNodeIn[]): void
  function visitSchemaNode(schemaNode: SchemaNode, visitor: SchemaNodeVisitor, include?: SchemaNodeIn[]): void
  function visitSchemaNode(
    schemaNode: any,
    visitor: SchemaNodeVisitor,
    include: SchemaNodeIn[] = [SchemaNodeIn.SLOTS, SchemaNodeIn.PROPS]
  ) {
    if (isPlainObject(schemaNode.props) && include.includes(SchemaNodeIn.PROPS)) {
      if (visitPropsSchemaNode(schemaNode.props, visitor, include)) {
        return
      }
    }

    if (isPlainObject(schemaNode.slots) && include.includes(SchemaNodeIn.SLOTS)) {
      for (const slot of Object.values(schemaNode.slots as SchemaNodeSlot[])) {
        if (isArray(slot.children) && slot.children.length > 0) {
          for (const schemaNodeChild of slot.children) {
            if (visitor(schemaNodeChild, slot.children, SchemaNodeIn.SLOTS)) {
              return
            }

            visitSchemaNode(schemaNodeChild, visitor, include)
          }
        }
      }
    }
  }

  function findSchemaNodeById(schemaNode: JSX.Element, id: SchemaNode['id']): JSX.Element | null
  function findSchemaNodeById(schemaNode: SchemaNode, id: SchemaNode['id']): SchemaNode | null
  function findSchemaNodeById(schemaNode: any, id: any): any {
    let founded = null

    visitSchemaNode(schemaNode, (schemaNode) => {
      if (schemaNode.id === id) {
        founded = schemaNode
        return true
      }
    })

    return founded
  }

  function removeSchemaNodeById(schemaNode: JSX.Element, id: SchemaNode['id']): JSX.Element
  function removeSchemaNodeById(schemaNode: SchemaNode, id: SchemaNode['id']): SchemaNode
  function removeSchemaNodeById(schemaNode: any, id: any): any {
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

  function createVNodeBinding(schemaNode: JSX.Element): SchemaNodeBinding
  function createVNodeBinding(schemaNode: SchemaNode): SchemaNodeBinding
  function createVNodeBinding(schemaNode: any): SchemaNodeBinding {
    return {
      type: BuiltInSchemaNodeBindingTypes.V_NODE_BINDING,
      value: schemaNode,
    }
  }

  function createRenderBinding(schemaNodes: JSX.Element[], renderId?: string): SchemaNodeBinding
  function createRenderBinding(schemaNodes: SchemaNode[], renderId?: string): SchemaNodeBinding
  function createRenderBinding(schemaNodes: any[], renderId?: string): SchemaNodeBinding {
    return {
      type: BuiltInSchemaNodeBindingTypes.RENDER_BINDING,
      renderId: renderId ?? generateId(),
      value: schemaNodes,
    }
  }

  function importSchema(schema: JSX.Element): SchemaPageNode | boolean
  function importSchema(schema: SchemaPageNode): SchemaPageNode | boolean
  function importSchema(schema: any): SchemaPageNode | boolean {
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
    isVNodeBinding,

    createExpressionBinding,
    createRenderBinding,
    createVNodeBinding,

    visitSchemaNode,

    cloneSchemaNode,
    findSchemaNodeById,
    removeSchemaNodeById,

    importSchema,
    exportSchema,

    // shorthand
    id: generateId,
    expression: createExpressionBinding,
    render: createRenderBinding,
    vNode: createVNodeBinding,
    clone: cloneSchemaNode,
    visit: visitSchemaNode,
    find: findSchemaNodeById,
    remove: removeSchemaNodeById,
  }
}

export default createSchemaManager()
