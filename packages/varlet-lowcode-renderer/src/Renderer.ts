import {
  defineComponent,
  h,
  ref,
  reactive,
  markRaw,
  computed,
  watch,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'vue'
import { BuiltInSchemaNodeNames, BuiltInSchemaNodeBindingTypes } from '@varlet/lowcode-core'
import { isArray, isPlainObject } from './shared'
import { get } from 'lodash-es'
import type { DefineComponent, PropType, VNode } from 'vue'
import type { SchemaPageNode, SchemaNode, SchemaTextNode } from '@varlet/lowcode-core'

declare const window: Window & {
  Varlet: Record<string, DefineComponent>
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
      window.$item = schemaNode._items
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
        return h(get(window.Varlet, schemaNode.name), getPropsBinding(schemaNode), renderSchemaNodeSlots(schemaNode))
      }

      return h(get(window.Varlet, schemaNode.name), getPropsBinding(schemaNode), renderSchemaNodeSlots(schemaNode))
    }

    function withCondition(schemaNodes: SchemaNode[]): SchemaNode[] {
      return schemaNodes.filter((schemaNode) => Boolean(getBindingValue(schemaNode.if ?? true, schemaNode)))
    }

    function withScopedVariables(schemaNodes: SchemaNode[], parentSchemaNode: SchemaNode) {
      schemaNodes.forEach((schemaNode) => {
        if (parentSchemaNode._items) {
          schemaNode._items = parentSchemaNode._items
        }

        if (parentSchemaNode._index) {
          schemaNode._index = parentSchemaNode._index
        }

        if (parentSchemaNode._slotProps) {
          schemaNode._slotProps = parentSchemaNode._slotProps
        }
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

          if (!newSchemaNode._items) {
            newSchemaNode._items = markRaw({})
          }

          if (!newSchemaNode._index) {
            newSchemaNode._index = markRaw({})
          }

          newSchemaNode._items[newSchemaNode.id] = item
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
        return Object.entries(schemaNode.slots).reduce((rawSlots, [slotName, schemaNodeChildren]) => {
          rawSlots[slotName] = (slotProps: any) => {
            if (slotProps) {
              if (!schemaNode._slotProps) {
                schemaNode._slotProps = markRaw({})
              }
              schemaNode._slotProps[schemaNode.id] = {}
              schemaNode._slotProps[schemaNode.id][slotName] = slotProps
            }

            const conditionedSchemaNodes = withCondition(schemaNodeChildren as SchemaNode[])
            const scopedSchemaNodes = withScopedVariables(conditionedSchemaNodes, schemaNode)
            const loopedSchemaNodes = withLoop(scopedSchemaNodes)

            return loopedSchemaNodes.map((schemaNodeChild) => renderSchemaNode(schemaNodeChild))
          }

          return rawSlots
        }, {} as RawSlots)
      }

      return {}
    }

    // TODO: handle designer mode logic
    watch(
      [() => props.schema.variables, () => props.schema.functions, () => props.schema.code],
      () => {
        window.location.reload()
      },
      {
        deep: true,
      }
    )

    hoistWindow()

    return () => h('div', { class: 'varlet-low-code-renderer' }, renderSchemaNodeSlots(props.schema))
  },
})
