import {
  defineComponent,
  h,
  renderList,
  ref,
  isRef,
  unref,
  toRefs,
  isProxy,
  isReactive,
  isReadonly,
  reactive,
  computed,
  readonly,
  watch,
  watchEffect,
  watchSyncEffect,
  watchPostEffect,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  withDirectives,
  Fragment,
  getCurrentInstance,
} from 'vue'
import { assetsManager, schemaManager, SchemaPageNodeDataSource } from '@varlet/lowcode-core'
import { isArray, isObject, isPlainObject, isString } from '@varlet/shared'
import { Drag, DragOver, Drop } from '@varlet/lowcode-dnd'
import { createAxle } from '@varlet/axle'
import { Snackbar } from '@varlet/ui'
import _exec from '@varlet/lowcode-exec'
import '@varlet/ui/es/snackbar/style/index'
import './renderer.less'

import type { PropType, VNode, DirectiveArguments } from 'vue'
import type { SchemaPageNode, SchemaNode, EventsManager, Assets } from '@varlet/lowcode-core'

declare const window: Window & {
  setup(): any
  $item?: Record<string, any>
  $index?: Record<string, any>
  $slotProps?: Record<string, any>
  $renderArgs?: Record<string, any[]>
  _rendererCtx: any
}

interface ScopeVariables {
  $item?: Record<string, any>
  $index?: Record<string, any>
  $slotProps?: Record<string, any>
  $renderArgs?: Record<string, any[]>
}

type RawSlots = {
  [name: string]: unknown
}

type RawProps = Record<string, any>

interface RendererDataSource {
  value: any

  load(params?: Record<string, any>, headers?: Record<string, any>): Promise<any>
}

type RendererDataSources = Record<string, RendererDataSource>

const axle = createAxle({})

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

    designerEventsManager: {
      type: Object as PropType<EventsManager>,
    },
  },

  setup(props) {
    const ctx = {
      h,
      ref,
      reactive,
      computed,
      readonly,
      watch,
      watchEffect,
      watchSyncEffect,
      watchPostEffect,
      isRef,
      unref,
      toRefs,
      isProxy,
      isReactive,
      isReadonly,
      onBeforeMount,
      onMounted,
      onBeforeUpdate,
      onUpdated,
      onBeforeUnmount,
      onUnmounted,
      exec,
      axle,
      useDataSources: createDataSources(props.schema.dataSources ?? []),
    }

    const { uid } = getCurrentInstance()!
    const code = props.schema.compatibleCode ?? props.schema.code ?? 'function setup() { return {} }'
    const setup = exec(code)
    const setupCtx = setup()

    Object.assign(ctx, setupCtx)

    if (props.mode === 'designer') {
      window._rendererCtx = ctx
    }

    function exec(expression: string, context?: any) {
      return _exec(expression, context ?? ctx)
    }

    function createDataSources(schemaDataSources: SchemaPageNodeDataSource[]) {
      function useDataSources() {
        return schemaDataSources.reduce(
          (
            rendererDataSources,
            { name, url, method, headers, timeout, withCredentials, successHandler, errorHandler }
          ) => {
            const load = async (params?: Record<string, any>, options?: Record<string, any>) => {
              try {
                const response = await axle.helpers[method](url, params, {
                  ...options,
                  headers,
                  timeout,
                  withCredentials,
                })

                const successHandlerFunction = schemaManager.isExpressionBinding(successHandler)
                  ? exec(`(${successHandler.compatibleValue ?? successHandler.value})`, window)
                  : undefined

                const value = await (successHandlerFunction?.(response) ?? response)

                rendererDataSource.value = value

                return value
              } catch (e: any) {
                const errorHandlerFunction = schemaManager.isExpressionBinding(errorHandler)
                  ? exec(`(${errorHandler.compatibleValue ?? errorHandler.value})`, window)
                  : undefined

                return errorHandlerFunction?.(e) ?? e
              }
            }

            const rendererDataSource = reactive({
              value: undefined,
              load,
            })

            rendererDataSources[name] = rendererDataSource

            return rendererDataSources
          },
          {} as RendererDataSources
        )
      }

      return useDataSources
    }

    function mountCss() {
      if (!props.schema.css) {
        return
      }

      const style = document.createElement('style')
      style.innerHTML = props.schema.css
      style.id = `varlet-low-code-css_${uid}`

      document.head.appendChild(style)
    }

    function unmountCss() {
      const style = document.querySelector(`#varlet-low-code-css_${uid}`)

      if (style) {
        document.head.removeChild(style)
      }
    }

    function setDndDisabledStyle() {
      const styles = document.createElement('style')
      const styleSheet = `
      .varlet-low-code--disable-events > * {
        pointer-events: none;
      }

      .varlet-low-code--disable-events {
        pointer-events: all;
      }
      `

      styles.id = `varlet-low-code-events`
      styles.innerHTML = styleSheet

      document.body.appendChild(styles)
    }

    function uninstallDndDisabledStyle() {
      const styles = document.querySelector('#varlet-low-code-events')

      styles && document.body.removeChild(styles)
    }

    function createNewScopeVariables(oldScopeVariables: ScopeVariables, partialScopeVariables: ScopeVariables) {
      return {
        ...oldScopeVariables,
        ...partialScopeVariables,
      }
    }

    function includesScopeVariable(expression: string) {
      return ['$item', '$index', '$slotProps', '$renderArgs'].some((scopedVariable) =>
        expression.includes(scopedVariable)
      )
    }

    function resolveScopedExpression(expression: string, scopeVariables: ScopeVariables) {
      window.$item = scopeVariables.$item
      window.$index = scopeVariables.$index
      window.$slotProps = scopeVariables.$slotProps
      window.$renderArgs = scopeVariables.$renderArgs

      const resolved = exec(expression)

      delete window.$item
      delete window.$index
      delete window.$slotProps
      delete window.$renderArgs

      return resolved
    }

    function getExpressionBindingValue(expression: string, scopeVariables: ScopeVariables) {
      if (!includesScopeVariable(expression)) {
        return exec(expression)
      }

      return resolveScopedExpression(expression, scopeVariables)
    }

    function getObjectBindingValue(value: any, scopeVariables: ScopeVariables) {
      return Object.keys(value).reduce((newValue, key) => {
        newValue[key] = getBindingValue(value[key], scopeVariables)

        return newValue
      }, {} as Record<string, any>)
    }

    function getBindingValue(value: any, scopeVariables: ScopeVariables): any {
      if (schemaManager.isRenderBinding(value)) {
        return (...args: any[]) => {
          const newScopeVariables = createNewScopeVariables(scopeVariables, {
            $renderArgs: {
              ...scopeVariables.$renderArgs,
              [value.renderId!]: args,
            },
          })

          const conditionedSchemaNodes = withCondition(value.value, newScopeVariables)

          return h(
            Fragment,
            conditionedSchemaNodes.map((schemaNode) => renderSchemaNode(schemaNode, newScopeVariables))
          )
        }
      }

      if (schemaManager.isVNodeBinding(value)) {
        const condition = getBindingValue(value.value.if, scopeVariables) ?? true

        return condition ? renderSchemaNode(value.value, scopeVariables) : undefined
      }

      if (schemaManager.isExpressionBinding(value)) {
        return getExpressionBindingValue(value.compatibleValue ?? value.value, scopeVariables)
      }

      if (schemaManager.isObjectBinding(value)) {
        return getObjectBindingValue(value, scopeVariables)
      }

      if (isArray(value)) {
        return value.map((value) => getBindingValue(value, scopeVariables))
      }

      return value
    }

    function renderText(textContent: string) {
      return isObject(textContent) ? JSON.stringify(textContent) : (textContent ?? '').toString()
    }

    function renderVNode(
      schemaNode: SchemaNode,
      scopeVariables: ScopeVariables,
      propsBinding: RawProps,
      classes: string[]
    ) {
      if (schemaManager.isSchemaTextNode(schemaNode)) {
        const { textContent } = schemaNode

        return h('span', { ...propsBinding, class: classes }, renderText(textContent))
      }

      return h(
        getComponent(schemaNode.name, schemaNode.library!),
        { ...propsBinding, class: classes },
        renderSchemaNodeSlots(schemaNode, scopeVariables)
      )
    }

    function getComponent(schemaNodeName: string, schemaNodeLibrary: string) {
      return assetsManager.findComponent(props.assets, schemaNodeName, schemaNodeLibrary)
    }

    function getPropsBinding(schemaNode: SchemaNode, scopeVariables: ScopeVariables) {
      const rawProps = Object.entries(schemaNode.props ?? {}).reduce((rawProps, [key, value]) => {
        rawProps[key] = getBindingValue(value, scopeVariables)

        return rawProps
      }, {} as RawProps)

      rawProps.id = `dragItem${schemaNode.id}`

      return rawProps
    }

    function normalizeClasses(value: unknown): string[] {
      return isArray(value) ? value : isString(value) ? value.split(' ') : []
    }

    function withDesigner(schemaNode: SchemaNode, scopeVariables: ScopeVariables) {
      const propsBinding = getPropsBinding(schemaNode, scopeVariables)
      const classes = normalizeClasses(propsBinding.class)

      if (props.mode !== 'designer') {
        return renderVNode(schemaNode, scopeVariables, propsBinding, classes)
      }

      const directives: DirectiveArguments = [
        [Drag, { dragData: schemaNode, eventsManager: props.designerEventsManager }],
        [Drop, { eventsManager: props.designerEventsManager }],
      ]

      classes.push('varlet-low-code--disable-events')

      return withDirectives(renderVNode(schemaNode, scopeVariables, propsBinding, classes), directives)
    }

    function withCondition(schemaNodes: SchemaNode[], scopeVariables: ScopeVariables): SchemaNode[] {
      return schemaNodes.filter((schemaNode) => !!getBindingValue(schemaNode.if ?? true, scopeVariables))
    }

    function renderSchemaNode(schemaNode: SchemaNode, scopeVariables: ScopeVariables): VNode {
      if (!schemaNode.hasOwnProperty('for')) {
        return withDesigner(schemaNode, scopeVariables)
      }

      const bindingValue = getBindingValue(schemaNode.for, scopeVariables)

      return h(
        Fragment,
        null,
        renderList(bindingValue, (item, index) => {
          const clonedSchemaNode = schemaManager.cloneSchemaNode(schemaNode)

          return withDesigner(
            clonedSchemaNode,
            createNewScopeVariables(scopeVariables, {
              $item: {
                ...scopeVariables.$item,
                [schemaNode.id!]: item,
              },
              $index: {
                ...scopeVariables.$index,
                [schemaNode.id!]: index,
              },
            })
          )
        })
      )
    }

    function renderSchemaNodeSlots(schemaNode: SchemaNode, scopeVariables: ScopeVariables): RawSlots {
      try {
        if (!isPlainObject(schemaNode.slots)) {
          return {}
        }

        return Object.entries(schemaNode.slots).reduce((rawSlots, [slotName, slot]) => {
          rawSlots[slotName] = (slotProps: any) => {
            const newScopeVariables = createNewScopeVariables(scopeVariables, {
              $slotProps: {
                ...scopeVariables.$slotProps,
                [schemaNode.id!]: slotProps,
              },
            })

            return withCondition(slot.children ?? [], newScopeVariables).map((schemaNode) =>
              renderSchemaNode(schemaNode, newScopeVariables)
            )
          }

          return rawSlots
        }, {} as RawSlots)
      } catch (e) {
        Snackbar.error('Renderer error, please check console')
        throw e
      }
    }

    setDndDisabledStyle()

    onMounted(mountCss)

    onUnmounted(() => {
      uninstallDndDisabledStyle()
      unmountCss()
    })

    return () =>
      props.mode === 'designer'
        ? withDirectives(
            h(
              'div',
              {
                style: 'min-height:100vh',
                class: 'varlet-low-code-renderer varlet-low-code-renderer__designer',
                mode: props.mode,
              },
              renderSchemaNodeSlots(props.schema, {})
            ),
            [
              [Drop, { eventsManager: props.designerEventsManager }],
              [DragOver, { eventsManager: props.designerEventsManager }],
            ]
          )
        : h('div', { class: 'varlet-low-code-renderer' }, renderSchemaNodeSlots(props.schema, {}))
  },
})
