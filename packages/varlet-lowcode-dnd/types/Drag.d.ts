import type { Directive, Plugin } from 'vue'
import { SchemaNode } from '@varlet/lowcode-core'
export interface DragOptions {
  id?: string
  dragStyle?: Partial<CSSStyleDeclaration>
  dragData: SchemaNode
  dragImg?: HTMLImageElement | HTMLCanvasElement
  type?: DataTransfer['effectAllowed']
}
declare const VarletLowCodeDrag: Directive<any, DragOptions> & Plugin
export default VarletLowCodeDrag
