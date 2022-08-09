import { ref } from 'vue'
import type { Ref } from 'vue'
import { TreeNode } from '.'

export const dndTree: Ref<TreeNode | undefined> = ref()
export const dragData: Ref<TreeNode | undefined> = ref()
export const onSubmit = ref()

export const onChangeNodeTree = ({ start, end }: any, direction: 'up' | 'down') => {
  deleteById(dndTree.value?.children || [], start.id)

  const endIndex = findIndexById(dndTree.value?.children || [], end?.id) ?? -1

  addInId(dndTree.value?.children || [], start, { id: end.id, endIndex }, direction)
}

export const onEnterNodeTree = ({ start, end }: any) => {
  deleteById(dndTree.value?.children || [], start.id)

  const endIndex = findIndexById(dndTree.value?.children || [], end?.id) ?? -1

  addInId(dndTree.value?.children || [], start, { id: end.id, endIndex }, 'insert')

  console.log('endIndex', dndTree.value)
}

const deleteById = (tree: TreeNode[], id: string): any => {
  for (const [i, treeNode] of tree.entries()) {
    if (treeNode.id === id) {
      tree.splice(i, 1)
      break
    } else if (treeNode.children && treeNode.children.length) {
      deleteById(treeNode.children, id)
    }
  }
}

const addInId = (
  tree: TreeNode[],
  node: TreeNode,
  { id, endIndex }: any,
  direction: 'up' | 'down' | 'insert' = 'up'
): any => {
  for (const [i, treeNode] of tree.entries()) {
    if (treeNode.id === id) {
      if (direction === 'insert') {
        treeNode.children!.push(node)
      }
      if (direction === 'up') {
        tree.splice(i, 0, node)
      }
      if (direction === 'down') {
        tree.splice(i + 1, 0, node)
      }
      break
    } else if (treeNode.children && treeNode.children.length) {
      addInId(treeNode.children, node, { id, endIndex }, direction)
    }
  }
}

const findIndexById = (tree: TreeNode[], id: string): number | undefined => {
  for (const [i, treeNode] of tree.entries()) {
    if (treeNode.id === id) {
      return i
    }
    if (treeNode.children && treeNode.children.length) {
      return findIndexById(treeNode.children, id)
    }
  }
}
