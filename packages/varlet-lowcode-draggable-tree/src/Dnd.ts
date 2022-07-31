import { TreeNode } from './props'
import DragTree from './DragTree'

export default class Dnd {
  dragNode: TreeNode | undefined

  dropNode: TreeNode | undefined

  overNode: TreeNode | undefined

  timer: any = null

  setDragNode(treeNode?: TreeNode) {
    this.dragNode = treeNode ?? undefined
  }

  setOverNode(treeNode: TreeNode, dragTree: DragTree) {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.overNode = treeNode

      dragTree.insertHolder(this.overNode)
    }, 200)
  }

  setDropNode(treeNode?: TreeNode) {
    this.dropNode = treeNode ?? undefined
  }
}
