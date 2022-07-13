export function mergeStyle(e: HTMLElement, newStyle: Partial<CSSStyleDeclaration>, reset = false) {
  const _style = e.style
  for (const key in newStyle) {
    if (Object.prototype.hasOwnProperty.call(newStyle, key)) {
      _style[key] = reset ? '' : <string>newStyle[key as keyof CSSStyleDeclaration]
    }
  }
}
