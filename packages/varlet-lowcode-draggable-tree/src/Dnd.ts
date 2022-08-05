import { TreeNode } from './props'
import DragTree from './DragTree'

export default class Dnd {
  dragNode: TreeNode | undefined

  dropNode: TreeNode | undefined

  overNode: TreeNode | undefined

  timer: any = null

  startY = 0

  nodeList: HTMLElement[] | undefined

  setDragNode(treeNode?: TreeNode) {
    this.dragNode = treeNode ?? undefined
  }

  clearDrag() {
    this.startY = 0
    this.setDragNode()
    this.overNode = undefined
    this.setDropNode()
    this.nodeList = undefined
  }

  setOverNode(treeNode: TreeNode, dragTree: DragTree) {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.overNode = treeNode

      dragTree.insertHolder(this.overNode)
    }, 1000)
  }

  setDropNode(treeNode?: TreeNode) {
    this.dropNode = treeNode ?? undefined
  }

  setOffsetY(y: number, dragTree: DragTree) {
    const offsetY = y - this.startY

    this.nodeList = Array.from(document.querySelectorAll('.varlet-low-code-draggable-tree-node__title'))

    const dragNodeIndex = this.nodeList.findIndex((node) => node.dataset.id === this.dragNode?.id)
    const i = Math.round(offsetY / 30) + dragNodeIndex

    console.log(i, 'iiiiii')
    const dropNodeIndex = i < 0 ? 0 : i > this.nodeList.length ? this.nodeList.length - 1 : i

    console.log(dropNodeIndex, 'dropNodeIndex')

    const node = dragTree.findNodeById(this.nodeList[dropNodeIndex].dataset!.id!)

    if (node.id === this.dropNode?.id) return false

    this.dropNode = node

    return true
  }
}
