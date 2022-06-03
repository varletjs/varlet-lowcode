export var BuiltInSchemaNodeNames;
(function (BuiltInSchemaNodeNames) {
    BuiltInSchemaNodeNames["PAGE"] = "Page";
    BuiltInSchemaNodeNames["TEXT"] = "Text";
})(BuiltInSchemaNodeNames || (BuiltInSchemaNodeNames = {}));
export function createSchemaManager() {
    let _schema;
    function importSchema(schema) {
        _schema = schema;
    }
    function exportSchema() {
        return _schema;
    }
    return {
        importSchema,
        exportSchema,
    };
}
export default createSchemaManager();
