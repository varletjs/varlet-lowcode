import UndoRedo from './UndoRedo.vue'
import { SkeletonLayouts } from '@varlet/lowcode-core'
import type { SkeletonPlugin } from '@varlet/lowcode-core'

const UndoRedoPlugin: SkeletonPlugin = {
  name: 'undo-repo',
  component: UndoRedo,
  layout: SkeletonLayouts.HEADER_RIGHT,
}

export default UndoRedoPlugin
