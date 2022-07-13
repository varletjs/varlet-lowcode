import { defineComponent, Comment, ref, Ref } from 'vue'
import { Icon } from '@varlet/ui'
import '@varlet/ui/es/icon/style/index.js'
import { props, TreeNode, treeNodeProps } from './props'
import './dragableTree.less'

export default defineComponent({
  name: 'VarletLowcodeDragableTree',
  props,
  setup(props) {
    const relation = new WeakMap()

    const renderTreeNodes: (treeNodes: TreeNode[], parentId?: string) => JSX.Element[] = (treeNodes, parentId) => {
      return treeNodes.map((_treeNode) => {
        relation.set(_treeNode, parentId)

        return (
          <DragableTreeNode treeNode={_treeNode}>
            {{
              default: () => (_treeNode.children?.length ? renderTreeNodes(_treeNode.children) : undefined),
            }}
          </DragableTreeNode>
        )
      })
    }

    return () => {
      return <div class="varlet-low-code-dragable-tree">{renderTreeNodes(props.tree)}</div>
    }
  },
})

const DragableTreeNode = defineComponent({
  name: 'DragableTreeNode',
  props: treeNodeProps,
  setup(props, { slots }) {
    const expand: Ref<boolean> = ref(false)
    const toggleExpand = () => {
      console.log(111)
      expand.value = !expand.value
    }

    return () => {
      const { treeNode } = props
      const vNodes = slots.default!() ?? []
      const renderSlots = vNodes.filter((vNode) => vNode.type !== Comment)

      return (
        <div class="varlet-low-code-dragable-tree-node">
          <div>
            {renderSlots.length ? (
              <Icon
                onClick={() => toggleExpand()}
                name="chevron-right"
                class={`${expand.value ? 'varlet-low-code-dragable-tree-node__icon-expand' : ''}`}
              />
            ) : null}{' '}
            {treeNode.text}
          </div>
          {expand.value ? renderSlots : null}
        </div>
      )
    }
  },
})
