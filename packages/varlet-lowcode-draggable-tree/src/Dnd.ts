import { TreeNode } from './props'

export default class Dnd {
  dragNode: TreeNode | undefined

  dropNode: TreeNode | undefined

  setDragNode(treeNode?: TreeNode) {
    this.dragNode = treeNode ?? undefined
  }

  setDropNode(treeNode?: TreeNode) {
    this.dropNode = treeNode ?? undefined
  }
}
