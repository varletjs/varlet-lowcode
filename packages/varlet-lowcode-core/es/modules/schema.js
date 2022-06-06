export var BuiltInSchemaNodeNames
;(function (BuiltInSchemaNodeNames) {
  BuiltInSchemaNodeNames['PAGE'] = 'Page'
  BuiltInSchemaNodeNames['TEXT'] = 'Text'
})(BuiltInSchemaNodeNames || (BuiltInSchemaNodeNames = {}))
export var BuiltInSchemaNodeBindingTypes
;(function (BuiltInSchemaNodeBindingTypes) {
  BuiltInSchemaNodeBindingTypes['FUNCTION_BINDING'] = 'Binding'
  BuiltInSchemaNodeBindingTypes['VARIABLE_BINDING'] = 'Variable'
  BuiltInSchemaNodeBindingTypes['EXPRESSION_BINDING'] = 'Expression'
})(BuiltInSchemaNodeBindingTypes || (BuiltInSchemaNodeBindingTypes = {}))
export function createSchemaManager() {
  let _schema
  function importSchema(schema) {
    _schema = schema
  }
  function exportSchema() {
    return _schema
  }
  return {
    importSchema,
    exportSchema,
  }
}
export default createSchemaManager()
