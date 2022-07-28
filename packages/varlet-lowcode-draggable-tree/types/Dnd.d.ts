import { TreeNode } from './props'
import DragTree from './DragTree'

export default class Dnd {
  dragNode: TreeNode | undefined

  dropNode: TreeNode | undefined

  overNode: TreeNode | undefined

  timer: any

  setDragNode(treeNode?: TreeNode): void

  setOverNode(treeNode: TreeNode, dragTree: DragTree): void

  setDropNode(treeNode?: TreeNode): void
}
