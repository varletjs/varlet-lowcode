import DraggableTree from './DraggableTree.vue'

export default DraggableTree

export interface TreeNode {
  id: string
  text?: string
  children?: TreeNode[]
}
