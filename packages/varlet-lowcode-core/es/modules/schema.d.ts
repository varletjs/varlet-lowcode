export interface SchemaManager {
    importSchema(schema: any): void;
    exportSchema(): any;
}
export declare type Schema = SchemaNode;
export declare enum BuiltInSchemaNodeNames {
    PAGE = "Page",
    TEXT = "Text"
}
export interface SchemaNode {
    id: string;
    name: string;
    props?: Record<string, any>;
    children?: (SchemaNode | SchemaTextNode)[];
}
export interface SchemaTextNode extends SchemaNode {
    name: BuiltInSchemaNodeNames.TEXT;
    textContent: string;
}
export interface SchemaPageNode extends SchemaNode {
    name: BuiltInSchemaNodeNames.PAGE;
    methods?: Record<string, any>;
    reactive?: Record<string, any>;
}
export declare function createSchemaManager(): SchemaManager;
declare const _default: SchemaManager;
export default _default;
