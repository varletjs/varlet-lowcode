import { DirectiveBinding } from 'vue'
import type { Directive, Plugin, App } from 'vue'
import { mergeStyle, eventBroadcast } from './shared'
import { SchemaNode } from '@varlet/lowcode-core'

export interface DragOptions {
  id?: string
  dragStyle?: Partial<CSSStyleDeclaration>
  dragData: SchemaNode
  dragImg?: HTMLImageElement | HTMLCanvasElement
  type?: DataTransfer['effectAllowed']
}

interface DragHTMLElement extends HTMLElement {
  _drag?: DragOptions
}

function onDragStart(this: DragHTMLElement, e: DragEvent) {
  if (e.target !== e.currentTarget) return

  const _drag = this._drag as DragOptions
  const { dragStyle, dragData, dragImg, type = 'all' } = _drag

  dragStyle && mergeStyle(this, dragStyle)
  dragImg && e.dataTransfer!.setDragImage(dragImg, 0, 0)
  dragData && e.dataTransfer!.setData('text/plain', JSON.stringify(dragData))
  e.dataTransfer!.effectAllowed = type

  eventBroadcast('drag-start', { dragEvent: e, dragOptions: JSON.parse(JSON.stringify(_drag)) })
}

function onDragEnter(this: DragHTMLElement, e: DragEvent) {
  e.stopPropagation()
  e.preventDefault()

  const _drag = this._drag as DragOptions

  if (this._drag?.id) {
    eventBroadcast('drag-enter', { dragEvent: e, dragOptions: JSON.parse(JSON.stringify(_drag)) })
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
  const { dragStyle } = _drag

  dragStyle && mergeStyle(this, dragStyle, true)

  eventBroadcast('drag-end', this)
}

function mounted(el: DragHTMLElement, props: DirectiveBinding<DragOptions>) {
  const defaultsProps = {
    dragStyle: {
      opacity: '.5',
    },
    type: 'move',
  } as DragOptions
  el._drag = { ...defaultsProps, ...props.value }
  el.draggable = true

  el.addEventListener('dragstart', onDragStart, { passive: false })
  el.addEventListener('dragenter', onDragEnter, { passive: false })
  el.addEventListener('dragover', onDragOver, { passive: false })
  el.addEventListener('dragend', onDragEnd, { passive: false })
}

function unmounted(el: HTMLElement) {
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
