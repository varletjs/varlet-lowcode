import { toRaw } from 'vue'
import type { Directive, Plugin, App, DirectiveBinding } from 'vue'
import { mergeStyle } from './shared'
import type { SchemaNode, EventsManager } from '@varlet/lowcode-core'

export interface DragOptions {
  id?: string
  dragStyle?: Partial<CSSStyleDeclaration>
  // TODO: this attributes will like this { schema: SchemaNode; snapshot: SnapShotType }
  dragData: SchemaNode
  eventsManager: EventsManager
  dragImg?: HTMLImageElement | HTMLCanvasElement
  type?: DataTransfer['effectAllowed']
}

interface DragHTMLElement extends HTMLElement {
  _drag?: DragOptions
}

function dragCanvasImg(name: string): HTMLImageElement {
  const oGrayImg = new Image()
  const newCanvas = document.createElement('canvas')
  newCanvas.setAttribute('width', `500px`)
  newCanvas.setAttribute('height', `200px`)
  const ctx = newCanvas.getContext('2d')
  ctx!.fillStyle = 'red'
  ctx!.fillRect(0, 0, 100, 30)

  ctx!.font = '12px Arial'
  ctx!.fillStyle = 'green'
  ctx!.textAlign = 'center'
  ctx!.fillText(name, 50, 20)

  oGrayImg.src = newCanvas.toDataURL('image/png')

  return oGrayImg
}

function onDragStart(this: DragHTMLElement, e: DragEvent) {
  if (e.target !== e.currentTarget) return

  const _drag = this._drag as DragOptions
  const { dragStyle, dragData, dragImg, type = 'all', eventsManager } = _drag

  dragStyle && mergeStyle(this, dragStyle)
  // TODO: `DragData` not only schema data and also some hook functions and snapshots
  // dragData.onDragStart that use on the Material library
  dragData && e.dataTransfer!.setData('text/plain', JSON.stringify(dragData))
  e.dataTransfer!.effectAllowed = type

  if (dragImg) {
    e.dataTransfer!.setDragImage(dragImg, 0, 0)
  } else {
    const _dragImg = dragCanvasImg(dragData.name)
    e.dataTransfer!.setDragImage(_dragImg, 50, 15)
  }

  eventsManager.emit('drag-start', {
    dragEvent: e,
    dragOptions: JSON.parse(JSON.stringify(_drag)),
    id: (<HTMLElement>e?.target).id,
  })
}

function onDragEnter(this: DragHTMLElement, e: DragEvent) {
  e.stopPropagation()
  e.preventDefault()

  const _drag = this._drag as DragOptions

  if (this._drag?.id) {
    _drag.eventsManager.emit('drag-enter', { dragEvent: e, dragOptions: JSON.parse(JSON.stringify(_drag)) })
  }
}

function onDragOver(this: DragHTMLElement, e: DragEvent) {
  e.preventDefault()
  // 后续计算鼠标用
  // eventBroadcast('drag-over', this)
}

function onDragEnd(this: DragHTMLElement, e: DragEvent) {
  e.preventDefault()

  const _drag = this._drag as DragOptions
  const { dragStyle, eventsManager } = _drag

  dragStyle && mergeStyle(this, dragStyle, true)

  eventsManager.emit('drag-end', this)
}

function mounted(el: DragHTMLElement, props: DirectiveBinding<DragOptions>) {
  const defaultsProps = {
    dragStyle: {
      opacity: '.5',
    },
    type: 'move',
  } as DragOptions
  el._drag = { ...defaultsProps, ...toRaw(props.value) }
  el.draggable = true

  el.addEventListener('dragstart', onDragStart, { passive: false })
  el.addEventListener('dragenter', onDragEnter, { passive: false })
  el.addEventListener('dragover', onDragOver, { passive: false })
  el.addEventListener('dragend', onDragEnd, { passive: false })
}

function unmounted(el: DragHTMLElement) {
  el._drag = undefined

  el.removeEventListener('dragstart', onDragStart)
  el.removeEventListener('dragenter', onDragEnter)
  el.removeEventListener('dragover', onDragOver)
  el.removeEventListener('dragend', onDragEnd)
}

export type VarletDragProps = Directive<any, DragOptions> & Plugin

export default {
  mounted,
  unmounted,
  install(app: App) {
    app.directive('drag', this)
  },
} as VarletDragProps
