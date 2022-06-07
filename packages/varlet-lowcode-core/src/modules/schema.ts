export interface SchemaManager {
  importSchema(schema: SchemaPageNode): void

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

export interface SchemaNode {
  id: string
  name: string
  props?: SchemaNodeProps
  slots?: Record<string, (SchemaNode | SchemaTextNode)[]>
  if?: SchemaNodeBinding
  for?: SchemaNodeBinding
  _items?: Record<string, any>
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
