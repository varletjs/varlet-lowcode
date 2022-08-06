import { ref } from 'vue'
import type { Ref } from 'vue'
import { TreeNode } from '.'

export const dndTree: Ref<TreeNode | undefined> = ref()
export const dragData: Ref<TreeNode | undefined> = ref()

export const onChangeNodeTree = ({ start, end }: any) => {
  deleteById(dndTree.value?.children || [], start.id)

  const endIndex = findIndexById(dndTree.value?.children || [], end?.id) ?? -1

  addInId(dndTree.value?.children || [], start, { id: end.id, endIndex })

  console.log('endIndex', dndTree.value)
}

export const onSubmit = (finallyTree: any) => {
  // TODO: eventsManager submit to other plugins
}

const deleteById = (tree: TreeNode[], id: string): any => {
  for (const [i, treeNode] of tree.entries()) {
    if (treeNode.id === id) {
      tree.splice(i, 1)
      break
    } else if (treeNode.children && treeNode.children.length) {
      deleteById(treeNode.children, id)
    }
    continue
  }
}

const addInId = (tree: TreeNode[], node: TreeNode, { id, endIndex }: any, direction?: 'up' | 'down'): any => {
  for (const [i, treeNode] of tree.entries()) {
    if (treeNode.id === id) {
      tree.splice(i, 0, node)
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
