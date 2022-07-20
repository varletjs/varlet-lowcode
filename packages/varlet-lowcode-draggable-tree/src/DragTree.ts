import { TreeNode } from './props'
import { eventsManager } from '@varlet/lowcode-core'

class DragTree {
  tree: TreeNode[] = []

  relation = new WeakMap()

  holder: null | TreeNode = null

  from?: TreeNode

  to?: TreeNode

  constructor(tree: TreeNode[]) {
    this.tree = tree
    this.setRelation(this.tree)
  }

  setTree(tree: TreeNode[]) {
    this.tree = tree
    this.relation = new WeakMap()
    this.setRelation(this.tree)
  }

  setRelation(treeNodes: TreeNode[], parentTreeNode?: TreeNode) {
    treeNodes.forEach((treeNode: TreeNode) => {
      this.relation.set(treeNode, parentTreeNode)

      if (treeNode.children?.length) {
        this.setRelation(treeNode.children, treeNode)
      }
    })
  }

  setFrom(fromNode: TreeNode) {
    this.from = fromNode
    this.holder = null
  }

  toggleTreeNodeChange(to: TreeNode) {
    this.to = to

    const toParentNode = this.findParentNode(this.to)
    const toParentChildren = toParentNode ? toParentNode?.children : this.tree
    const toIndex = toParentChildren.findIndex((node: TreeNode) => {
      return node.id === this.to!.id
    })

    if (this.holder) {
      this.removeNode(this.holder)
    } else {
      this.holder = {
        id: 'holder',
      }
    }

    toParentChildren && toParentChildren.splice(toIndex, 0, this.holder)

    eventsManager.emit('treeUpdate', this.tree)
  }

  addNode(to: TreeNode, node: TreeNode) {
    const parentNode = this.findParentNode(to)
    const parentChildren = parentNode ? parentNode?.children : this.tree
    const index = parentChildren.findIndex((child: TreeNode) => {
      return child.id === to.id
    })
    parentChildren && parentChildren.splice(index, 0, node)
  }

  removeNode(node: TreeNode) {
    const parentNode = this.findParentNode(node)
    const parentChildren = parentNode ? parentNode?.children : this.tree
    const index = parentChildren.findIndex((child: TreeNode) => {
      return child.id === node.id
    })

    parentChildren && parentChildren.splice(index, 1)
  }

  submitTreeNodeChange() {
    this.removeNode(<TreeNode>this.from)

    this.addNode(<TreeNode>this.to, <TreeNode>this.from)

    this.removeNode(<TreeNode>this.holder)

    this.from = undefined
    this.to = undefined
    this.holder = null
  }

  findParentNode(treeNode: TreeNode) {
    return this.relation.get(treeNode)
  }
}

export default DragTree
