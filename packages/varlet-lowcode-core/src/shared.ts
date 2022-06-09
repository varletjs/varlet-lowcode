export const isPlainObject = (val: unknown): val is Record<string, any> =>
  Object.prototype.toString.call(val) === '[object Object]'

export const isArray = (val: unknown): val is Array<any> => Array.isArray(val)

export const removePrivateProperty = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (key.startsWith('_')) {
      Reflect.deleteProperty(obj, key)
    }
  })
}

export const removeItem = (arr: Array<unknown>, item: unknown) => {
  if (arr.length) {
    const index: number = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
