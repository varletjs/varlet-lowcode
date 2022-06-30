export function getLeft(element: HTMLElement): number {
  const { left } = element.getBoundingClientRect()

  return left + (document.body.scrollLeft || document.documentElement.scrollLeft)
}

export function getTop(element: HTMLElement): number {
  const { top } = element.getBoundingClientRect()

  return top + (document.body.scrollTop || document.documentElement.scrollTop)
}
