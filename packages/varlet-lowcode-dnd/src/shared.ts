import { eventsManager } from '@varlet/lowcode-core'

export function mergeStyle(e: HTMLElement, newStyle: Partial<CSSStyleDeclaration>, reset = false) {
  const _style = e.style
  for (const key in newStyle) {
    if (Object.prototype.hasOwnProperty.call(newStyle, key)) {
      _style[key] = reset ? '' : <string>newStyle[key as keyof CSSStyleDeclaration]
    }
  }
}

export function eventBroadcast(event: string, args: any) {
  eventsManager.emit(event, args)
}
