import { TreeNode } from '../props'
import { Ref, ref, watch } from 'vue'
import { eventsManager } from '@varlet/lowcode-core'

const _relation = ref(new WeakMap())
const _tree: Ref<TreeNode[]> = ref([])

export default function useTree(tree?: TreeNode[]) {
  const setRelation = (treeNodes: TreeNode[], parentId?: string) => {
    treeNodes.forEach((_treeNode: TreeNode) => {
      _relation.value.set(_treeNode, parentId)

      if (_treeNode.children?.length) {
        setRelation(_treeNode.children, _treeNode.id)
      }
    })
  }

  if (tree) {
    _tree.value = tree

    setRelation(tree)
  }

  watch(
    () => tree,
    (newVal) => {
      if (newVal?.length) {
        setRelation(newVal)
      }
    },
    { deep: true }
  )

  const toggleTreeNodeChange = (from: TreeNode, to: TreeNode) => {
    const formNode = findParentNode(from) || {
      children: _tree.value,
    }
    const toNode = findParentNode(to) || {
      children: _tree.value,
    }

    const fromIndex = formNode.children.findIndex((node: TreeNode) => node.id === from.id)
    const toIndex = toNode.children.findIndex((node: TreeNode) => {
      return node.id === to.id
    })

    formNode.children.splice(fromIndex, 1)
    toNode.children.splice(toIndex, 0, from)

    eventsManager.emit('treeUpdate', _tree.value)

    console.log(_tree.value)
  }

  const findParentNode = (node: TreeNode): any => {
    const parentId = _relation.value.get(node)

    return findNodeById(parentId)
  }

  const findNodeById = (id: undefined | number | string, treeNodes = _tree.value) => {
    if (!id) {
      return
    }

    let node = null

    treeNodes.forEach((treeNode) => {
      if (treeNode.id === id) {
        node = treeNode
      } else if (treeNode.children) {
        node = findNodeById(id, treeNode.children)
      }
    })

    return node
  }

  return {
    setRelation,
    relation: _relation.value,
    toggleTreeNodeChange,
  }
}
