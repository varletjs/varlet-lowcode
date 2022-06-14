export const isPlainObject = (val: unknown): val is Record<string, any> =>
  Object.prototype.toString.call(val) === '[object Object]'

export const isArray = (val: unknown): val is Array<any> => Array.isArray(val)

export const isString = (val: unknown): val is string => typeof val === 'string'

export function kebabCase(str: string): string {
  const ret = str.replace(/([A-Z])/g, ' $1').trim()
  return ret.split(' ').join('-').toLowerCase()
}
