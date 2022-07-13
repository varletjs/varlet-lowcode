import { defineComponent, PropType } from 'vue'

const props = {
  tree: {
    type: Array as PropType<TreeNode[]>,
    required: true,
    default: () => [],
  },
}

interface TreeNode {
  id: string | number
  text: string
  children?: TreeNode[]
}

export default defineComponent({
  name: 'VarletLowcodeDragableTree',
  props,
  setup(props) {
    console.log(props.tree)
  },
})
