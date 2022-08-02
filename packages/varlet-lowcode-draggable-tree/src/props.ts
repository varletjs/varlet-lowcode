import { PropType } from 'vue'
import DragTree from './DragTree'
import Dnd from './Dnd'

export interface TreeNode {
  id: string
  text?: string
  children?: TreeNode[]
}

export const treeProps = {
  tree: {
    type: Array as PropType<TreeNode[]>,
    required: true,
    default: () => [],
  },

  'onUpdate:tree': {
    type: Function as PropType<(value: TreeNode[]) => void>,
  },
}

export const treeNodeProps = {
  treeNode: {
    type: Object as PropType<TreeNode>,
    required: true,
    default: () => {},
  },
  dragTree: {
    type: Object as PropType<DragTree>,
    required: true,
  },
  indent: {
    type: Number,
    required: true,
  },
  dnd: {
    type: Object as PropType<Dnd>,
    required: true,
  },
}
