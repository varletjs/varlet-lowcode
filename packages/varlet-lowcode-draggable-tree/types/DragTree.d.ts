import { TreeNode } from './props'

declare class DragTree {
  tree: TreeNode[]

  relation: WeakMap<object, any>

  holder: null | TreeNode

  from?: TreeNode

  to?: TreeNode

  constructor(tree: TreeNode[])

  setTree(tree: TreeNode[]): void

  setRelation(treeNodes: TreeNode[], parentTreeNode?: TreeNode): void

  setFrom(fromNode: TreeNode): void

  insertHolder(node: TreeNode): void

  insertNode(): void

  initHolder(): void

  toggleTreeNodeChange(to: TreeNode): void

  addNode(to: TreeNode, node: TreeNode): void

  removeNode(node: TreeNode): void

  submitTreeNodeChange(): void

  findParentNode(treeNode: TreeNode): any
}
export default DragTree
