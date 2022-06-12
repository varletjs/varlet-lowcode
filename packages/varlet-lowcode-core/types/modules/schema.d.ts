export interface SchemaManager {
  visitSchemaNode(schemaNode: SchemaNode, schemaNodeVisitor: SchemaNodeVisitor, schemaNodeSiblings?: SchemaNode[]): void
  cloneSchemaNode<T extends SchemaNode>(schemaNode: T): T
  findSchemaNodeById(schemaNode: SchemaNode, id: SchemaNode['id']): SchemaNode | null
  removeSchemaNodeById(schemaNode: SchemaNode, id: SchemaNode['id']): SchemaNode
  importSchema(schemaPageNode: SchemaPageNode): SchemaPageNode
  exportSchema(): SchemaPageNode
}
export declare enum BuiltInSchemaNodeNames {
  PAGE = 'Page',
  TEXT = 'Text',
}
export declare enum BuiltInSchemaNodeBindingTypes {
  OBJECT_BINDING = 'Object',
  EXPRESSION_BINDING = 'Expression',
}
export declare type SchemaNodeProps = Record<string, SchemaNodeBinding>
export declare type SchemaNodeBinding = any
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
export declare type SchemaNodeVisitor = (
  schemaNode: SchemaNode,
  schemaNodeSiblings: SchemaNode[] | null
) => boolean | void
export declare function createSchemaManager(): SchemaManager
declare const _default: SchemaManager
export default _default
