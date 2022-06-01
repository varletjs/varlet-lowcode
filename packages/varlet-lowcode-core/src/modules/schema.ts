export interface SchemaManager {
  importSchema(schema: any): void

  exportSchema(): any
}

export type Schema = SchemaNode

export type SchemaNode = {
  // 节点唯一标识
  id: string
  // 组件名称
  name: string
  // 物料属性集合
  props?: Record<string, any>
  // 子节点集合
  children?: SchemaNode[]
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
