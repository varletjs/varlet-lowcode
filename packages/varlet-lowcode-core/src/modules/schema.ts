export interface SchemaManager {
  importSchema(schema: any): void

  exportSchema(): any
}

export enum BuiltInSchemaNodeNames {
  PAGE = 'Page',
  TEXT = 'Text',
}

export enum BuiltInSchemaNodeBindingTypes {
  FUNCTION_BINDING = 'Binding',
  VARIABLE_BINDING = 'Variable',
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

export interface SchemaPageNode extends SchemaNode {
  name: BuiltInSchemaNodeNames.PAGE
  functions?: Record<string, any>
  variables?: Record<string, any>
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
