export interface SchemaManager {
  importSchema(schema: any): void

  exportSchema(): any
}

export type Schema = SchemaNode

export enum BuiltInSchemaNodeNames {
  PAGE = 'Page',
  TEXT = 'Text',
}

export interface SchemaNode {
  id: string
  name: string
  props?: Record<string, any>
  children?: (SchemaNode | SchemaTextNode)[]
}

export interface SchemaTextNode extends SchemaNode {
  name: BuiltInSchemaNodeNames.TEXT
  textContent: string
}

export interface SchemaPageNode extends SchemaNode {
  name: BuiltInSchemaNodeNames.PAGE
  methods?: Record<string, any>
  reactive?: Record<string, any>
}

export function createSchemaManager(): SchemaManager {
  let _schema: Schema

  function importSchema(schema: Schema) {
    _schema = schema
  }

  function exportSchema(): Schema {
    return _schema
  }

  return {
    importSchema,

    exportSchema,
  }
}

export default createSchemaManager()
