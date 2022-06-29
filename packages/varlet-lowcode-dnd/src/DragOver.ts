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
  const list = Array.from(document.querySelectorAll('.drop-item'))

  if (!list || list.length === 0) return []

  // filter the nodes that draped
  return (
    list
      // .filter((item) => item.id !== 'dragItem0')
      .map((node: Element) => {
        const rect = node.getBoundingClientRect()

        return {
          id: node.id,
          xAxis: [rect.left, rect.right],
          yAxis: [rect.top, rect.bottom],
        }
      })
  )
}

// get the nearest direction of the mouse on the node
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

// get the nearest distance of the mouse on the node
function getDistance(
  pageY: number,
  pageX: number,
  top: number,
  bottom: number,
  left: number,
  right: number,
  direction: NearestDirection,
  id: string,
  between?: boolean
): number {
  const minX = Math.min(Math.abs(pageX - left), Math.abs(pageX - right))
  const minY = Math.min(Math.abs(pageY - top), Math.abs(pageY - bottom))

  if (between) {
    if (direction === 'left' || direction === 'right') {
      console.log('id', id, minX)
      return minX
    }
    if (direction === 'top' || direction === 'bottom') {
      return minY
    }
  }

  return Math.sqrt(minX * minX + minY * minY)
}

function calculateStyle(event: DragEvent): NearestOptions | null {
  const { pageY, pageX } = event

  if (!nodeComputedStyles || nodeComputedStyles.length === 0) return null

  // get the nodes that these nearest to the mouse
  const nearestList: NearestOptions[] = nodeComputedStyles.map(({ id, xAxis, yAxis }) => {
    const [left, right] = xAxis
    const [top, bottom] = yAxis

    const direction = getDirection(pageY, pageX, top, bottom, left, right)

    const thisTheNearest: NearestOptions = {
      id,
      direction,
      type: 'outside',
      distance: getDistance(pageY, pageX, top, bottom, left, right, direction, id, true),
    }

    // if the mouse is in the range of the node, it's must inside in the inside node
    if (pageX > left && pageX < right && pageY > top && pageY < bottom) {
      thisTheNearest.type = 'inside'
    }

    // if the mouse is not in the range of the node, it's must outside in the nearest node
    if ((pageX < left || pageX > right) && (pageY < top || pageY > bottom)) {
      thisTheNearest.distance = getDistance(pageY, pageX, top, bottom, left, right, direction, id, false)
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
    left: direction === 'right' ? `${nearestStyle?.right || 0}px` : `${nearestStyle?.left || 0}px`,
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

function mounted() {
  console.log('init finished 666')

  nodeComputedStyles = getDomRectInfo()

  const borderDiv = document.createElement('div')

  borderDiv.id = 'varlet-lowcode-dnd-border'
  borderDiv.style.position = 'fixed'
  borderDiv.style.backgroundColor = 'blue'

  document.body.appendChild(borderDiv)

  document.addEventListener('dragover', onDragOver, { passive: false })
}

function unmounted() {
  const borderDiv = document.querySelector('#varlet-lowcode-dnd-border')
  if (borderDiv) {
    document.body.removeChild(borderDiv)
  }

  // remove the nodeComputedStyles that this directive unmounted
  nodeComputedStyles = undefined
  document.removeEventListener('dragover', onDragOver)
}

export type VarletMouseMoveProps = Directive<any, DragOverOption>

export default {
  mounted,
  unmounted,
} as VarletMouseMoveProps
