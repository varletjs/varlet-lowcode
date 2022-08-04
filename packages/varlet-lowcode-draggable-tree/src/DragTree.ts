import { TreeNode } from './props'
import { eventsManager } from '@varlet/lowcode-core'

class DragTree {
  tree: TreeNode[] = []

  relation = new WeakMap()

  holder: null | TreeNode = null

  holderParentNode: null | TreeNode = null

  from?: TreeNode

  to?: TreeNode

  onChange: any

  constructor(tree: TreeNode[], onChange: any) {
    this.tree = JSON.parse(JSON.stringify(tree))
    this.onChange = onChange
    this.setRelation(this.tree)
  }

  resetRelation() {
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

  findNodeById(id: string | number, tree = this.tree): any {
    for (const node of tree) {
      if (node.id === id) {
        return node
      }
      if (node.children) {
        return this.findNodeById(id, node.children)
      }
    }
  }

  setFrom(fromNode: TreeNode) {
    this.from = fromNode

    this.clearHolder()
  }

  insertHolder(node: TreeNode) {
    this.initHolder()

    node?.children?.splice(0, 0, this.holder!)

    this.resetRelation()
  }

  clearHolder() {
    if (this.holder) {
      this.removeNode(<TreeNode>this.holder)
      this.relation.delete(this.holder)
      this.holder = null
      this.holderParentNode = null
    }
  }

  insertNode() {
    this.clearHolder()

    this.removeNode(this.from!)

    if (this.to?.children?.length) {
      this.to?.children?.splice(0, 0, this.from!)
    } else {
      this.to?.children?.push(this.from!)
    }

    this.onChange(this.tree)

    this.from = undefined
    this.to = undefined
    // this.holder = null
  }

  initHolder() {
    this.clearHolder()

    this.holder = {
      id: 'holder',
    }
  }

  toggleTreeNodeChange(to: TreeNode, isNext: boolean) {
    this.to = to

    this.initHolder()

    console.log(this.to, this.holder!, isNext, 'aaaaa')
    this.addNode(this.to, this.holder!, isNext)

    this.resetRelation()

    this.holderParentNode = this.findParentNode(this.holder!)
  }

  addNode(to: TreeNode, node: TreeNode, isNext: boolean) {
    console.log(to, node, isNext, 'bbbbb')
    const parentNode = this.findParentNode(to)
    const parentChildren = parentNode ? parentNode!.children : this.tree
    const index = parentChildren.findIndex((child: TreeNode) => {
      return child.id === to.id
    })

    parentChildren && parentChildren.splice(index + Number(isNext), 0, node)
  }

  removeNode(node: TreeNode) {
    console.log(node, 'ddddd')

    const parentNode = this.findParentNode(node)
    const parentChildren = parentNode ? parentNode?.children : this.tree
    const index = parentChildren.findIndex((child: TreeNode) => {
      return child.id === node.id
    })

    if (index < 0) return

    parentChildren && parentChildren.splice(index, 1)
  }

  submitTreeNodeChange(isNext: boolean) {
    if (!this.from || !this.to) {
      return
    }
    this.clearHolder()

    this.removeNode(<TreeNode>this.from)
    this.addNode(<TreeNode>this.to, <TreeNode>this.from, isNext)

    this.from = undefined
    this.to = undefined

    this.onChange(this.tree)
  }

  findParentNode(treeNode: TreeNode) {
    const node = this.findNodeById(treeNode.id)

    return this.relation.get(node)
  }
}

export default DragTree
