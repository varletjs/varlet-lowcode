export interface SchemaManager {
  importSchema(schema: SchemaPageNode): void

  exportSchema(): SchemaPageNode
}

export enum BuiltInSchemaNodeNames {
  PAGE = 'Page',
  TEXT = 'Text',
}

export enum BuiltInSchemaNodeBindingTypes {
  FUNCTION_BINDING = 'Binding',
  VARIABLE_BINDING = 'Variable',
  EXPRESSION_BINDING = 'Expression',
}

export type SchemaNodeProps = Record<string, any>

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

export function createSchemaManager(): SchemaManager {
  let _schema: SchemaPageNode

  function importSchema(schema: SchemaPageNode) {
    _schema = schema
  }

  function exportSchema(): SchemaPageNode {
    return _schema
  }

  return {
    importSchema,

    exportSchema,
  }
}

export default createSchemaManager()
