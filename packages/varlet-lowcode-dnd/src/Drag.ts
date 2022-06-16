import { DirectiveBinding } from 'vue'
import type { Directive, Plugin, App } from 'vue'
import { mergeStyle } from './shared'

interface DragOptions {
  dragStyle?: CSSStyleDeclaration
  dragData?: string | Record<string, any>
  dragImg?: HTMLImageElement | HTMLCanvasElement
  type?: DataTransfer['effectAllowed']
}

interface DragHTMLElement extends HTMLElement {
  _drag?: DragOptions
}

function onDragStart(this: DragHTMLElement, e: DragEvent) {
  const _drag = this._drag as DragOptions
  const { dragStyle, dragData, dragImg, type = 'all' } = _drag
  // TODO：这里由于采用csstyle的方式，所以不能直接设置style，需要通过mergeStyle方法来合并，但由于后续不好去除所以暂时隐藏
  dragStyle && mergeStyle(this, dragStyle)
  dragImg && e.dataTransfer!.setDragImage(dragImg, 0, 0)
  dragData && e.dataTransfer!.setData('text/plain', typeof dragData === 'string' ? dragData : JSON.stringify(dragData))
  e.dataTransfer!.effectAllowed = type
}

function onDragEnter(this: DragHTMLElement, e: DragEvent) {
  e.stopPropagation()
}

function onDragOver(this: DragHTMLElement, e: DragEvent) {
  e.preventDefault()
}

function onDragEnd(this: DragHTMLElement, e: DragEvent) {
  e.preventDefault()
  const _drag = this._drag as DragOptions
  const { dragStyle } = _drag
  dragStyle && mergeStyle(this, dragStyle)
}

function mounted(el: DragHTMLElement, props: DirectiveBinding<DragOptions>) {
  el._drag = { ...props.value }
  el.addEventListener('dragstart', onDragStart, { passive: true })
  el.addEventListener('dragenter', onDragEnter, { passive: true })
  el.addEventListener('dragover', onDragOver, { passive: true })
  el.addEventListener('dragend', onDragEnd, { passive: true })
}

function unmounted(el: HTMLElement) {
  el.removeEventListener('dragstart', onDragStart)
  el.removeEventListener('dragenter', onDragEnter)
  el.removeEventListener('dragover', onDragOver)
  el.removeEventListener('dragend', onDragEnd)
}

const VarletLowCodeDrag: Directive & Plugin = {
  mounted,
  unmounted,
  install(app: App) {
    app.directive('drag', this)
  },
}

export default VarletLowCodeDrag
