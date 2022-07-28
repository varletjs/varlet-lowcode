import { PropType } from 'vue'
import DragTree from './DragTree'
import Dnd from './Dnd'

export interface TreeNode {
  id: string
  text?: string
  children?: TreeNode[]
}
export declare const treeProps: {
  tree: {
    type: PropType<TreeNode[]>
    required: boolean
    default: () => never[]
  }
  'onUpdate:tree': {
    type: PropType<(value: TreeNode[]) => void>
  }
}
export declare const treeNodeProps: {
  treeNode: {
    type: PropType<TreeNode>
    required: boolean
    default: () => void
  }
  dragTree: {
    type: PropType<DragTree>
    required: boolean
  }
  dnd: {
    type: PropType<Dnd>
    required: boolean
  }
}
