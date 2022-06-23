export const removePrivateProperty = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (key.startsWith('_')) {
      Reflect.deleteProperty(obj, key)
    }
  })
}

export const removeHyphen = (str: string) => {
  return str.replace(/-/g, '')
}
