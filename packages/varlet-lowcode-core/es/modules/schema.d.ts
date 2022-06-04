export interface SchemaManager {
  importSchema(schema: any): void
  exportSchema(): any
}
export declare enum BuiltInSchemaNodeNames {
  PAGE = 'Page',
  TEXT = 'Text',
}
export declare enum BuiltInSchemaNodeBindingTypes {
  FUNCTION_BINDING = 'Binding',
  VARIABLE_BINDING = 'Variable',
}
export declare type SchemaNodeProps = Record<string, any>
export interface SchemaNode {
  id: string
  name: string
  props?: SchemaNodeProps
  slots?: Record<string, (SchemaNode | SchemaTextNode)[]>
}
export interface SchemaTextNode extends SchemaNode {
  name: BuiltInSchemaNodeNames.TEXT
  textContent: string
}
export interface SchemaPageNode extends SchemaNode {
  name: BuiltInSchemaNodeNames.PAGE
  functions?: Record<string, any>
  variables?: Record<string, any>
}
export declare function createSchemaManager(): SchemaManager
declare const _default: SchemaManager
export default _default
