import { PropType } from 'vue'

export interface TreeNode {
  id: string
  text: string
  children?: TreeNode[]
}

export const props = {
  tree: {
    type: Array as PropType<TreeNode[]>,
    required: true,
    default: () => [],
  },
}

export const treeNodeProps = {
  treeNode: {
    type: Object as PropType<TreeNode>,
    required: true,
    default: () => {},
  },
}
