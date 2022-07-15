import { Ref, ref } from 'vue'
import { TreeNode } from '../props'

const dragNode: Ref<TreeNode | null> = ref(null)
const dropNode: Ref<TreeNode | null> = ref(null)

export default function useDnd() {
  const setDragNode = (treeNode?: TreeNode) => {
    dragNode.value = treeNode ?? null
  }

  const setDropNode = (treeNode?: TreeNode) => {
    dropNode.value = treeNode ?? null
  }

  return {
    dragNode,
    dropNode,
    setDragNode,
    setDropNode,
  }
}
