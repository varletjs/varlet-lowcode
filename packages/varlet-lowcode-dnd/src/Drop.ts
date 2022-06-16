import { DirectiveBinding } from 'vue'
import type { Directive, Plugin, App } from 'vue'
import { mergeStyle } from './shared'

interface DropOptions {
  dropStyle?: CSSStyleDeclaration
  type?: DataTransfer['dropEffect']
}

interface DropHTMLElement extends HTMLElement {
  _drop?: DropOptions
}

function onDropEnter(this: DropHTMLElement, e: DragEvent) {
  if (e.target !== e.currentTarget) return
  const _drop = this._drop as DropOptions
  const { dropStyle } = _drop
  dropStyle && mergeStyle(this, dropStyle)
}

function onDragLeave(this: DropHTMLElement, e: DragEvent) {
  if (e.target !== e.currentTarget) return
  e.dataTransfer!.dropEffect = 'none'
}

function onDragOver(this: DropHTMLElement, e: DragEvent) {
  const _drop = this._drop as DropOptions
  const { type = 'none' } = _drop
  e.preventDefault()
  e.dataTransfer!.dropEffect = type
}

function onDrop(this: DropHTMLElement, e: DragEvent) {
  // const data = e.dataTransfer!.getData('text/plain')
}

function mounted(el: DropHTMLElement, props: DirectiveBinding<DropOptions>) {
  el._drop = { ...props.value }
  el.addEventListener('dragenter', onDropEnter, { passive: true })
  el.addEventListener('dragleave', onDragLeave, { passive: true })
  el.addEventListener('dragover', onDragOver, { passive: true })
  el.addEventListener('drop', onDrop, { passive: true })
}

function unmounted(el: HTMLElement) {
  el.removeEventListener('dragenter', onDropEnter)
  el.removeEventListener('dragleave', onDragLeave)
  el.removeEventListener('dragover', onDragOver)
  el.removeEventListener('drop', onDrop)
}

const VarletLowCodeDrop: Directive & Plugin = {
  mounted,
  unmounted,
  install(app: App) {
    app.directive('drop', this)
  },
}

export default VarletLowCodeDrop
