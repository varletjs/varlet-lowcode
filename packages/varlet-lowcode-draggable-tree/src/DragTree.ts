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

  insertHolder(node: TreeNode) {
    this.initHolder()

    node?.children?.splice(0, 0, this.holder!)

    eventsManager.emit('treeUpdate', this.tree)
  }

  insertNode() {
    if (this.holder) {
      this.removeNode(this.holder)
    }

    this.removeNode(this.from!)

    if (this.to?.children?.length) {
      this.to?.children?.splice(0, 0, this.from!)
    } else {
      this.to?.children?.push(this.from!)
    }

    eventsManager.emit('treeUpdate', this.tree)

    this.from = undefined
    this.to = undefined
    this.holder = null
  }

  initHolder() {
    if (this.holder) {
      this.removeNode(this.holder)
      this.holder = null
    }

    this.holder = {
      id: 'holder',
    }
  }

  toggleTreeNodeChange(to: TreeNode, isNext: boolean) {
    this.to = to

    this.initHolder()

    this.addNode(this.to, this.holder!, isNext)

    eventsManager.emit('treeUpdate', this.tree)
  }

  addNode(to: TreeNode, node: TreeNode, isNext: boolean) {
    const parentNode = this.findParentNode(to)
    const parentChildren = parentNode ? parentNode!.children : this.tree
    const index = parentChildren.findIndex((child: TreeNode) => {
      return child.id === to.id
    })

    parentChildren && parentChildren.splice(index + Number(isNext), 0, node)
  }

  removeNode(node: TreeNode) {
    const parentNode = this.findParentNode(node)
    const parentChildren = parentNode ? parentNode?.children : this.tree
    const index = parentChildren.findIndex((child: TreeNode) => {
      return child.id === node.id
    })

    if (index < 0) return

    parentChildren && parentChildren.splice(index, 1)
  }

  submitTreeNodeChange(isNext: boolean) {
    this.removeNode(<TreeNode>this.holder)
    this.removeNode(<TreeNode>this.from)
    this.addNode(<TreeNode>this.to, <TreeNode>this.from, isNext)

    this.from = undefined
    this.to = undefined
    this.holder = null
  }

  findParentNode(treeNode: TreeNode) {
    return this.relation.get(treeNode)
  }
}

export default DragTree
