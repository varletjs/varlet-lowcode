import { TreeNode } from '../props'
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
      const holderParentNode = this.findParentNode(this.holder)

      const holderParentChildren = holderParentNode ? holderParentNode?.children : this.tree

      const holderIndex = holderParentChildren.findIndex((node: TreeNode) => {
        return node.id === this.holder!.id
      })

      holderParentChildren && holderParentChildren.splice(holderIndex, 1)
    } else {
      this.holder = {
        id: 'holder',
      }
    }

    toParentChildren && toParentChildren.splice(toIndex, 0, this.holder)

    eventsManager.emit('treeUpdate', this.tree)
  }

  submitTreeNodeChange() {
    const fromParentNode = this.findParentNode(this.from)
    const fromParentChildren = fromParentNode ? fromParentNode?.children : this.tree
    const fromIndex = fromParentChildren.findIndex((node: TreeNode) => {
      return node.id === this.from!.id
    })

    fromParentChildren && fromParentChildren.splice(fromIndex, 1)

    const toParentNode = this.findParentNode(this.to)
    const toParentChildren = toParentNode ? toParentNode?.children : this.tree
    const toIndex = toParentChildren.findIndex((node: TreeNode) => {
      return node.id === this.to!.id
    })
    toParentChildren && toParentChildren.splice(toIndex, 0, this.from)

    const holderParentNode = this.findParentNode(this.holder)
    const holderParentChildren = holderParentNode ? holderParentNode?.children : this.tree
    const holderIndex = holderParentChildren.findIndex((node: TreeNode) => {
      return node.id === this.holder!.id
    })

    holderParentChildren && holderParentChildren.splice(holderIndex, 1)

    this.from = undefined
    this.to = undefined
    this.holder = null
  }

  findParentNode(treeNode: TreeNode) {
    return this.relation.get(treeNode)
  }
}

export default DragTree
