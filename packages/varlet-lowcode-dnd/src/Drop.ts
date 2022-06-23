import { DirectiveBinding } from 'vue'
import type { Directive, Plugin, App } from 'vue'
import { mergeStyle, eventBroadcast } from './shared'
import { SchemaNode } from '@varlet/lowcode-core'

export interface DropOptions {
  dropStyle?: Partial<CSSStyleDeclaration>
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
  
  eventBroadcast('drop-enter', this)
}

function onDropLeave(this: DropHTMLElement, e: DragEvent) {
  if (e.target !== e.currentTarget) return

  e.dataTransfer!.dropEffect = 'none'
  const _drop = this._drop as DropOptions
  const { dropStyle } = _drop

  dropStyle && mergeStyle(this, dropStyle, true)

  eventBroadcast('drop-leave', this)
}

function onDragOver(this: DropHTMLElement, e: DragEvent) {
  e.preventDefault()

  const _drop = this._drop as DropOptions
  const { type = 'none' } = _drop
  
  e.dataTransfer!.dropEffect = type
  // eventBroadcast('drop-over', this)
}

function onDropEnd(this: DropHTMLElement, e: DragEvent) {
  const _data = e.dataTransfer!.getData('text/plain')

  if (!_data) return

  const _dragData: SchemaNode = JSON.parse(_data)
  const _drop = this._drop as DropOptions
  const { dropStyle } = _drop

  dropStyle && mergeStyle(this, dropStyle, true)

  eventBroadcast('drop-end', { el: this, data: _dragData })
}

function onDrop(this: DropHTMLElement, e: DragEvent) {
  const _data = e.dataTransfer!.getData('text/plain')

  if (!_data) return

  const _dragData: SchemaNode = JSON.parse(_data)
  const _drop = this._drop as DropOptions
  const { dropStyle } = _drop

  dropStyle && mergeStyle(this, dropStyle, true)
  
  eventBroadcast('drop', { el: this, data: _dragData })
}

function mounted(el: DropHTMLElement, props: DirectiveBinding<DropOptions>) {
  el._drop = { ...props.value }

  el.addEventListener('dragenter', onDropEnter, { passive: false })
  el.addEventListener('dragend', onDropEnd, { passive: false })
  el.addEventListener('dragleave', onDropLeave, { passive: false })
  el.addEventListener('dragover', onDragOver, { passive: false })
  el.addEventListener('drop', onDrop, { passive: false })
}

function unmounted(el: HTMLElement) {
  el.removeEventListener('dragenter', onDropEnter)
  el.removeEventListener('dragleave', onDropLeave)
  el.removeEventListener('dragover', onDragOver)
  el.removeEventListener('drop', onDrop)
}

export type VarletDropProps = Directive<any, DropOptions> & Plugin

export default {
  mounted,
  unmounted,
  install(app: App) {
    app.directive('drop', this)
  },
} as VarletDropProps
