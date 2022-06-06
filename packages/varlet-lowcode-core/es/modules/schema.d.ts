export interface SchemaManager {
  importSchema(schema: SchemaPageNode): void
  exportSchema(): SchemaPageNode
}
export declare enum BuiltInSchemaNodeNames {
  PAGE = 'Page',
  TEXT = 'Text',
}
export declare enum BuiltInSchemaNodeBindingTypes {
  FUNCTION_BINDING = 'Binding',
  VARIABLE_BINDING = 'Variable',
  EXPRESSION_BINDING = 'Expression',
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
export interface SchemaPageNodeLifeCycles {
  onBeforeMount?: SchemaNodeFunction
  onMounted?: SchemaNodeFunction
  onBeforeUpdate?: SchemaNodeFunction
  onUpdated: SchemaNodeFunction
  onBeforeUnmount: SchemaNodeFunction
  onUnmounted: SchemaNodeFunction
}
export interface SchemaNodeFunction {
  async: boolean
  params: string[]
  body: string
}
export interface SchemaPageNode extends SchemaNode {
  name: BuiltInSchemaNodeNames.PAGE
  functions?: Record<string, SchemaNodeFunction>
  variables?: Record<string, any>
  lifeCycles?: SchemaPageNodeLifeCycles
  code?: string
}
export declare function createSchemaManager(): SchemaManager
declare const _default: SchemaManager
export default _default
