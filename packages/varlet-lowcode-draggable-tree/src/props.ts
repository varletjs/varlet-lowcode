import { PropType } from 'vue'

export interface TreeNode {
  id: string
  text: string
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
}
