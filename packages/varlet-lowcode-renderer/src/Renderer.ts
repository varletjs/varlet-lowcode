import {
  defineComponent,
  h,
  ref,
  reactive,
  computed,
  watch,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'vue'
import lowCode, {
  BuiltInSchemaNodeNames,
  BuiltInSchemaNodeBindingTypes,
  SchemaNodeSlot,
  Assets,
} from '@varlet/lowcode-core'
import { isArray, isPlainObject } from './shared'
import type { PropType, VNode } from 'vue'
import type { SchemaPageNode, SchemaNode, SchemaTextNode } from '@varlet/lowcode-core'

declare const window: Window & {
  $slotProps?: Record<string, any>
  $item?: Record<string, any>
  $index?: Record<string, any>
}

type RawSlots = {
  [name: string]: unknown
}

type RawProps = Record<string, any>

Object.assign(window, {
  ref,
  reactive,
  computed,
  watch,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
})

export default defineComponent({
  name: 'VarletLowCodeRenderer',

  props: {
    mode: {
      type: String as PropType<'designer' | 'render'>,
      default: 'render',
    },

    schema: {
      type: Object as PropType<SchemaPageNode>,
      required: true,
      default: () => ({}),
    },

    assets: {
      type: Array as PropType<Assets>,
      required: true,
      default: () => [],
    },
  },

  setup(props) {
    const setup = eval(`(${props.schema.code ?? 'function setup() { return {} }'})`)
    const ctx = setup()

    function cloneSchemaNode(schemaNode: SchemaNode) {
      return JSON.parse(JSON.stringify(schemaNode))
    }

    function hoistWindow() {
      Object.assign(window, ctx)
    }

    function hasScopedVariables(expression: string) {
      return ['$item', '$index', '$slotProps'].some((scopedVariable) => expression.includes(scopedVariable))
    }

    function resolveScopedExpression(expression: string, schemaNode: SchemaNode) {
      window.$item = schemaNode._item
      window.$index = schemaNode._index
      window.$slotProps = schemaNode._slotProps

      const resolved = eval(expression)

      delete window.$item
      delete window.$index
      delete window.$slotProps

      return resolved
    }

    function getExpressionBindingValue(expression: string, schemaNode: SchemaNode) {
      if (!hasScopedVariables(expression)) {
        return eval(expression)
      }

      return resolveScopedExpression(expression, schemaNode)
    }

    function getBindingValue(value: any, schemaNode: SchemaNode) {
      if (isPlainObject(value)) {
        const { value: bindingValue, type: bindingType } = value

        if (bindingType === BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING) {
          return getExpressionBindingValue(bindingValue, schemaNode)
        }

        if (bindingType === BuiltInSchemaNodeBindingTypes.OBJECT_BINDING) {
          return bindingValue
        }
      }

      return value
    }

    function getComponent(schemaNodeName: string) {
      return lowCode.assetsManager.findComponent(props.assets, schemaNodeName)
    }

    function getPropsBinding(schemaNode: SchemaNode) {
      const rawProps = Object.entries(schemaNode.props ?? {}).reduce((rawProps, [key, value]) => {
        rawProps[key] = getBindingValue(value, schemaNode)

        return rawProps
      }, {} as RawProps)

      return rawProps
    }

    function withDesigner(schemaNode: SchemaNode) {
      if (props.mode === 'designer') {
        // TODO: wrap designer component
        return h(getComponent(schemaNode.name), getPropsBinding(schemaNode), renderSchemaNodeSlots(schemaNode))
      }

      return h(getComponent(schemaNode.name), getPropsBinding(schemaNode), renderSchemaNodeSlots(schemaNode))
    }

    function withCondition(schemaNodes: SchemaNode[]): SchemaNode[] {
      return schemaNodes.filter((schemaNode) => Boolean(getBindingValue(schemaNode.if ?? true, schemaNode)))
    }

    function withScopedVariables(schemaNodes: SchemaNode[], parentSchemaNode: SchemaNode, parentSlot: SchemaNodeSlot) {
      const slotProps = { ...parentSchemaNode._slotProps, ...parentSlot._slotProps }
      parentSlot._slotProps = slotProps

      schemaNodes.forEach((schemaNode) => {
        if (parentSchemaNode._item) {
          schemaNode._item = parentSchemaNode._item
        }

        if (parentSchemaNode._index) {
          schemaNode._index = parentSchemaNode._index
        }

        schemaNode._slotProps = slotProps
      })

      return schemaNodes
    }

    function withLoop(schemaNodes: SchemaNode[]): SchemaNode[] {
      const flatSchemaNodes: SchemaNode[] = []

      schemaNodes.forEach((schemaNode) => {
        if (!Object.hasOwn(schemaNode, 'for')) {
          flatSchemaNodes.push(schemaNode)
          return
        }

        let items: any = getBindingValue(schemaNode.for, schemaNode)

        if (!isArray(items)) {
          items = Array.from({ length: Number(items) || 0 })
        }

        ;(items as any[]).forEach((item, index) => {
          const newSchemaNode = cloneSchemaNode(schemaNode)

          if (!newSchemaNode._item) {
            newSchemaNode._item = {}
          }

          if (!newSchemaNode._index) {
            newSchemaNode._index = {}
          }

          newSchemaNode._item[newSchemaNode.id] = item
          newSchemaNode._index[newSchemaNode.id] = index

          flatSchemaNodes.push(newSchemaNode)
        })
      })

      return flatSchemaNodes
    }

    function renderSchemaNode(schemaNode: SchemaNode): VNode | string {
      if (schemaNode.name === BuiltInSchemaNodeNames.TEXT) {
        const textContent = getBindingValue((schemaNode as SchemaTextNode).textContent, schemaNode)
        return isPlainObject(textContent) ? JSON.stringify(textContent) : textContent.toString()
      }

      return withDesigner(schemaNode)
    }

    function renderSchemaNodeSlots(schemaNode: SchemaNode): RawSlots {
      if (isPlainObject(schemaNode.slots)) {
        return Object.entries(schemaNode.slots).reduce((rawSlots, [slotName, slot]) => {
          rawSlots[slotName] = (slotProps: any) => {
            if (!slot._slotProps) {
              slot._slotProps = {}
            }

            slot._slotProps[schemaNode.id] = slotProps

            const slotChildren = slot.children ?? []
            const conditionedSchemaNodes = withCondition(slotChildren as SchemaNode[])
            const scopedSchemaNodes = withScopedVariables(conditionedSchemaNodes, schemaNode, slot)
            const loopedSchemaNodes = withLoop(scopedSchemaNodes)

            return loopedSchemaNodes.map((schemaNodeChild) => renderSchemaNode(schemaNodeChild))
          }

          return rawSlots
        }, {} as RawSlots)
      }

      return {}
    }

    hoistWindow()

    return () => h('div', { class: 'varlet-low-code-renderer' }, renderSchemaNodeSlots(props.schema))
  },
})
