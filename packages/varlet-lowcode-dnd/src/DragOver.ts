import type { Directive } from 'vue'

type NearestDirection = 'left' | 'top' | 'right' | 'bottom'

interface DomRectInfo {
  id: string
  xAxis: [number, number]
  yAxis: [number, number]
}

interface NearestOptions {
  type: "inside" | "outside"
  direction: "left" | "top" | "right" | "bottom"
  id: string
  distance: number
}

export interface DragOverOption {
  blockStyle?: Partial<CSSStyleDeclaration>
}

// avoid repeatedly obtaining doms information
let nodeComputedStyles: DomRectInfo[] | undefined

function getDomRectInfo(): DomRectInfo[] {
  const list = Array.from(document.querySelectorAll('.drag-item'))

  if (!list || list.length === 0) return []

  return list.map((node: Element) => {
    const rect = node.getBoundingClientRect()

    return {
      id: node.id,
      xAxis: [rect.left, rect.right],
      yAxis: [rect.top, rect.bottom]
    }
  })
}

// get the nearest direction of the mouse on the node
function getDirection(
  screenY: number, 
  screenX: number, 
  top: number, 
  bottom: number, 
  left: number, 
  right: number
): NearestDirection {
  const minX = Math.min(Math.abs(screenX - left), Math.abs(screenX - right))
  const minY = Math.min(Math.abs(screenY - top), Math.abs(screenY - bottom))

  if (minX <= minY) {
    return minX === Math.abs(screenX - left) ? 'left' : 'right'
  }

  return minY === Math.abs(screenY - top) ? 'top' : 'bottom'
}

// get the nearest distance of the mouse on the node
function getDistance(
  screenY: number, 
  screenX: number, 
  top: number, 
  bottom: number, 
  left: number, 
  right: number, 
  direction: NearestDirection, 
  between?: boolean
): number {
  const minX = Math.min(Math.abs(screenX - left), Math.abs(screenX - right))
  const minY = Math.min(Math.abs(screenY - top), Math.abs(screenY - bottom))

  if (between) {
    if (direction === 'left' || direction === 'right') {
      return minX
    }
    if (direction === 'top' || direction === 'bottom') {
      return minY
    }
  } else {
    return Math.sqrt(minX * minX + minY * minY);
  }

  return 0
}

function calculateStyle(event: DragEvent): NearestOptions | null {
  const { screenY, screenX } = event


  if (!nodeComputedStyles || nodeComputedStyles.length === 0) return null

  // get the nodes that these nearest to the mouse
  const nearestList: NearestOptions[] = nodeComputedStyles.map(({ id, xAxis, yAxis }) => {
    const [left, right] = xAxis
    const [top, bottom] = yAxis
    const direction = getDirection(screenY, screenX, top, bottom, left, right)

    const thisTheNearest: NearestOptions = {
      id,
      direction,
      type: 'outside',
      distance: getDistance(screenY, screenX, top, bottom, left, right, direction, true)
    }

    // if the mouse is in the range of the node, it's must inside in the inside node
    if (screenX > left && screenX < right && screenY > top && screenY < bottom) {
      thisTheNearest.type = 'inside'
    }
    
    // if the mouse is not in the range of the node, it's must outside in the nearest node
    if ((screenX < left || screenX > right) && (screenY < top && screenY > bottom)) {
      thisTheNearest.distance = getDistance(screenY, screenX, top, bottom, left, right, direction, false)
    }

    return thisTheNearest
  })


  nearestList.sort((a, b) => a.distance - b.distance)
  console.log("nearest", nearestList);

  // TODO: calculate something
  return null
}

function onDragOver(event: DragEvent) {
  const nearestNodeInfo = calculateStyle(event)
}

function mounted(el: HTMLElement, props: DragOverOption) {
  nodeComputedStyles = getDomRectInfo()
  document.addEventListener('dragover', onDragOver, { passive: false })
}

function unmounted() {
  // remove the nodeComputedStyles that this directive unmounted
  nodeComputedStyles = undefined
  document.removeEventListener('dragover', onDragOver)
}

export type VarletMouseMoveProps = Directive<any, DragOverOption>

export default {
  mounted,
  unmounted,
} as VarletMouseMoveProps
