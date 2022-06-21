import type { Directive, Plugin } from 'vue'

import vDrag from './Drag'
import vDrop from './Drop'

import type { DragOptions } from './Drag'
import type { DropOptions } from './Drop'

export interface VarletDndProps {
  Drag: Directive<any, DragOptions> & Plugin
  Drop: Directive<any, DropOptions> & Plugin
}

const VarletDnd: VarletDndProps = {
  Drag: vDrag,
  Drop: vDrop,
}

export default VarletDnd

export * from './Drag'
export * from './Drop'
