export declare const isPlainObject: (val: unknown) => val is Record<string, any>
export declare const isArray: (val: unknown) => val is any[]
export declare const removePrivateProperty: (obj: Record<string, any>) => void
export declare const removeItem: (arr: Array<unknown>, item: unknown) => unknown[] | undefined
