import { TreeNode } from './props'

export default class Dnd {
  dragNode: TreeNode | undefined

  dropNode: TreeNode | undefined

  overNode: TreeNode | undefined

  timer: any = null

  setDragNode(treeNode?: TreeNode) {
    this.dragNode = treeNode ?? undefined
  }

  setOverNode(treeNode: TreeNode) {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.overNode = treeNode
      console.log(this.overNode)
    }, 1000)
  }

  setDropNode(treeNode?: TreeNode) {
    this.dropNode = treeNode ?? undefined
  }
}
