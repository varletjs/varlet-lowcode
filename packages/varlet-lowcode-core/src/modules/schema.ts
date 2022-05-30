let schemaInstance: any = null

export function importSchema(schema: any) {
  schemaInstance = schema
}

export function exportSchema(): any {
  return schemaInstance
}

export interface Schema {
  importSchema(schema: any): void

  exportSchema(): any
}

export const schema: Schema = {
  importSchema,

  exportSchema,
}

export default schema
