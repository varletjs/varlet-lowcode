import { eventsManager } from '@varlet/lowcode-core'
import type { Directive } from 'vue'
import { mergeStyle } from './shared'

type NearestDirection = 'left' | 'top' | 'right' | 'bottom'

interface DomRectInfo {
  id: string
  xAxis: [number, number]
  yAxis: [number, number]
}

interface NearestOptions {
  type: 'inside' | 'outside'
  direction: 'left' | 'top' | 'right' | 'bottom'
  id: string
  distance: number
}

export interface DragOverOption {
  blockStyle?: Partial<CSSStyleDeclaration>
}

// avoid repeatedly obtaining doms information
let nodeComputedStyles: DomRectInfo[] | undefined

function getDomRectInfo(): DomRectInfo[] {
  const list = Array.from(document.querySelectorAll('.varlet-low-code--disable-events'))

  if (!list || list.length === 0) return []

  return list.map((node: Element) => {
    const rect = node.getBoundingClientRect()

    return {
      id: node.id,
      xAxis: [rect.left, rect.right],
      yAxis: [rect.top, rect.bottom],
    }
  })
}

function getDirection(
  pageY: number,
  pageX: number,
  top: number,
  bottom: number,
  left: number,
  right: number
): NearestDirection {
  const minX = Math.min(Math.abs(pageX - left), Math.abs(pageX - right))
  const minY = Math.min(Math.abs(pageY - top), Math.abs(pageY - bottom))

  if (minX <= minY) {
    return minX === Math.abs(pageX - left) ? 'left' : 'right'
  }

  return minY === Math.abs(pageY - top) ? 'top' : 'bottom'
}

function getDistance(
  pageY: number,
  pageX: number,
  top: number,
  bottom: number,
  left: number,
  right: number,
  direction: NearestDirection,
  type: 'outside' | 'inside',
  between?: boolean
): number {
  const minX = Math.min(Math.abs(pageX - left), Math.abs(pageX - right))
  const minY = Math.min(Math.abs(pageY - top), Math.abs(pageY - bottom))

  if (between) {
    if (direction === 'left' || direction === 'right') {
      return type === 'inside' ? minX : minY
    }
    if (direction === 'top' || direction === 'bottom') {
      return type === 'inside' ? minY : minX
    }
  }

  return Math.sqrt(minX * minX + minY * minY)
}

function calculateStyle(event: DragEvent): NearestOptions | null {
  const { pageY, pageX } = event

  if (!nodeComputedStyles || nodeComputedStyles.length === 0) return null

  const nearestList: NearestOptions[] = nodeComputedStyles.map(({ id, xAxis, yAxis }) => {
    const [left, right] = xAxis
    const [top, bottom] = yAxis

    const direction = getDirection(pageY, pageX, top, bottom, left, right)

    const thisTheNearest: NearestOptions = {
      id,
      direction,
      type: 'outside',
      distance: getDistance(pageY, pageX, top, bottom, left, right, direction, 'outside', true),
    }

    if (pageX > left && pageX < right && pageY > top && pageY < bottom) {
      thisTheNearest.type = 'inside'
      thisTheNearest.distance = getDistance(pageY, pageX, top, bottom, left, right, direction, 'inside', true)
    }

    if ((pageX < left || pageX > right) && (pageY < top || pageY > bottom)) {
      thisTheNearest.distance = getDistance(pageY, pageX, top, bottom, left, right, direction, 'outside', false)
    }

    return thisTheNearest
  })

  nearestList.sort((a, b) => a.distance - b.distance)

  if (nearestList && nearestList.length > 0) {
    return nearestList[0]
  }

  return null
}

function renderBorder(nearestNodeInfo: NearestOptions) {
  const { id, direction } = nearestNodeInfo

  const borderDiv = document.querySelector('#varlet-lowcode-dnd-border') as HTMLElement
  const nearestDom = document.querySelector(`#${id}`)

  const nearestStyle = nearestDom?.getBoundingClientRect()

  const distance: Partial<CSSStyleDeclaration> = {
    left:
      direction === 'right' ? `${nearestStyle?.right ? nearestStyle?.right - 4 : 0}px` : `${nearestStyle?.left || 0}px`,
    top: direction === 'bottom' ? `${nearestStyle?.bottom || 0}px` : `${nearestStyle?.top || 0}px`,
  }

  borderDiv &&
    mergeStyle(borderDiv, {
      width: direction === 'left' || direction === 'right' ? '4px' : `${nearestStyle?.width}px`,
      height: direction === 'top' || direction === 'bottom' ? '4px' : `${nearestStyle?.height}px`,
      ...distance,
    })
}

function onDragOver(event: DragEvent) {
  const nearestNodeInfo = calculateStyle(event)

  nearestNodeInfo && renderBorder(nearestNodeInfo)
}

// TODO: this params need a types from the Drag, the other params also need type from the Drop
function onDragStart({ id }: any) {
  if (!id) {
    throw new Error(`this Node is not a Really Dom`)
  }

  if (id) {
    nodeComputedStyles = getDomRectInfo()
    nodeComputedStyles = nodeComputedStyles.filter((item) => item.id !== `${id}`)
  }
}

function onDragEnd() {
  const borderDiv = document.querySelector('#varlet-lowcode-dnd-border') as HTMLDivElement

  if (borderDiv) {
    borderDiv.style.width = `0px`
    borderDiv.style.height = `0px`
  }
}

function mounted(el: HTMLElement) {
  const borderDiv = document.createElement('div')

  borderDiv.id = 'varlet-lowcode-dnd-border'
  borderDiv.style.position = 'absolute'
  borderDiv.style.backgroundColor = 'blue'
  borderDiv.style.zIndex = '99999'

  document.body.appendChild(borderDiv)

  el.addEventListener('dragover', onDragOver, { passive: false })
  eventsManager.on('drag-start', onDragStart)
  eventsManager.on('drag-end', onDragEnd)
}

function unmounted(el: HTMLElement) {
  const borderDiv = document.querySelector('#varlet-lowcode-dnd-border')

  borderDiv && document.body.removeChild(borderDiv)

  nodeComputedStyles = undefined

  el.removeEventListener('dragover', onDragOver)
  eventsManager.off('drag-start', onDragStart)
  eventsManager.off('drag-end', onDragEnd)
}

export type VarletMouseMoveProps = Directive<any, DragOverOption>

export default {
  mounted,
  unmounted,
} as VarletMouseMoveProps
