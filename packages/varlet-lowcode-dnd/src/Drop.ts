import { DirectiveBinding } from 'vue'
import type { Directive, Plugin, App } from 'vue'
import { mergeStyle } from './shared'
import type { EventsManager, SchemaNode } from '@varlet/lowcode-core'

export interface DropOptions {
  dropStyle?: Partial<CSSStyleDeclaration>
  type?: DataTransfer['dropEffect']
  eventsManager: EventsManager
}

export interface DropHTMLElement extends HTMLElement {
  _drop?: DropOptions
}

function onDropEnter(this: DropHTMLElement) {
  const _drop = this._drop as DropOptions
  const { dropStyle, eventsManager } = _drop

  dropStyle && mergeStyle(this, dropStyle)

  eventsManager.emit('drop-enter', this)
}

function onDropLeave(this: DropHTMLElement, e: DragEvent) {
  if (e.target !== e.currentTarget) return

  e.dataTransfer!.dropEffect = 'none'
  const _drop = this._drop as DropOptions
  const { dropStyle, eventsManager } = _drop

  dropStyle && mergeStyle(this, dropStyle, true)

  eventsManager.emit('drop-leave', this)
}

function onDragOver(this: DropHTMLElement, e: DragEvent) {
  e.preventDefault()

  const _drop = this._drop as DropOptions
  const { type = 'none' } = _drop

  e.dataTransfer!.dropEffect = type
}

function onDropEnd(this: DropHTMLElement, e: DragEvent) {
  const _data = e.dataTransfer!.getData('text/plain')

  if (!_data) return

  const _dragData: SchemaNode = JSON.parse(_data)
  const _drop = this._drop as DropOptions
  const { dropStyle, eventsManager } = _drop

  dropStyle && mergeStyle(this, dropStyle, true)

  eventsManager.emit('drop-end', { el: this, data: _dragData })
}

function onDrop(this: DropHTMLElement, e: DragEvent) {
  e.stopPropagation()

  const _data = e.dataTransfer!.getData('text/plain')

  if (!_data) return

  const _dragData: SchemaNode = JSON.parse(_data)
  const _drop = this._drop as DropOptions
  const { dropStyle, eventsManager } = _drop

  dropStyle && mergeStyle(this, dropStyle, true)

  // TODO: this data's type is same as the DragOptions.dragData
  eventsManager.emit('drop', { el: this, data: _dragData })
}

function mounted(el: DropHTMLElement, props: DirectiveBinding<DropOptions>) {
  const defaultProps = {
    dropStyle: {
      background: '#bfcef5',
    },
    type: 'move',
  } as DropOptions
  el._drop = { ...defaultProps, ...props.value }

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
