import { TreeNode } from './props'
import { ref, watch } from 'vue'

const relation = ref(new WeakMap())

export default function useTree() {
  const setRelation = (treeNodes: TreeNode[], parentId?: string) => {
    treeNodes.forEach((_treeNode) => {
      relation.value.set(_treeNode, parentId)

      if (_treeNode.children?.length) {
        setRelation(_treeNode.children, _treeNode.id)
      }
    })
  }

  const toggleTreeNodeChange = (from: TreeNode, to: TreeNode) => {
    relation.value.set(from, to.id)
  }

  watch(
    () => relation.value,
    (newVal, oldValue) => {
      console.log(newVal)
    },
    { deep: true }
  )

  return {
    setRelation,
    relation,
    toggleTreeNodeChange,
  }
}
