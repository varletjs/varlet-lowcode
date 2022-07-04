import type { DefineComponent, Ref } from 'vue'
import { computed, defineComponent, ref, Teleport, watch } from 'vue'
import { AppBar, Icon, Ripple, Skeleton, Space } from '@varlet/ui'
import { pluginsManager, SkeletonLayouts, SkeletonPlugin } from '@varlet/lowcode-core'
import { getTop } from './shared'
import '@varlet/ui/es/app-bar/style/index.js'
import '@varlet/ui/es/icon/style/index.js'
import '@varlet/ui/es/space/style/index.js'
import '@varlet/ui/es/skeleton/style/index.js'
import '@varlet/ui/es/ripple/style/index'
import './skeleton.less'
import { useLoading } from './useLoading'

export default defineComponent({
  name: 'Skeleton',
  directives: { ripple: Ripple },
  setup() {
    const plugins = pluginsManager.exportSkeletonPlugins()
    const sidebarPinned = ref(false)
    const sidebarActiveComponent: Ref<string | undefined> = ref()
    const sidebarFocusComponent: Ref<SkeletonPlugin | undefined> = ref()
    const { loading } = useLoading()
    const sidebarRefs: Ref<Record<string, HTMLElement>> = ref({})

    const sidebarRef = (el: any, pluginName: string) => {
      if (!sidebarRefs.value[pluginName]) {
        sidebarRefs.value[pluginName] = el
      }
    }

    const transitionStyle = computed(() => {
      if (!sidebarFocusComponent.value) return {}

      const top = getTop(sidebarRefs.value[sidebarFocusComponent.value?.name] as HTMLElement)

      return {
        top: `calc(${top}px + 8px)`,
      }
    })

    watch(
      () => loading.value,
      (newVal) => {
        if (newVal) {
          sidebarActiveComponent.value = undefined
        }
      }
    )

    const toggleSidebarActive = (name: string) => {
      sidebarActiveComponent.value = name === sidebarActiveComponent.value ? undefined : name
    }

    const toggleSidebarFocus = (plugin?: SkeletonPlugin) => {
      sidebarFocusComponent.value = plugin || undefined
    }

    const pickerComponents = (layout: SkeletonLayouts) => {
      const _plugins: SkeletonPlugin[] = plugins.filter((plugin) => plugin.layout === layout)

      if (!_plugins || _plugins.length === 0) {
        throw new Error(`${layout} is not a valid layout`)
      }

      let rows = 1
      let rowsWidth = ['30vw']

      if (layout.includes('sidebar')) {
        return (
          <div class="skeleton__sidebar--container">
            {_plugins.map((plugin: SkeletonPlugin) => {
              const { icon: iconName, name } = plugin
              return (
                <>
                  <div v-show={Boolean(loading.value)}>
                    <Skeleton loading={Boolean(loading.value)} avatar rows="0" />
                  </div>

                  <div
                    v-ripple
                    ref={(el) => sidebarRef(el, name)}
                    v-show={Boolean(!loading.value)}
                    class={`skeleton__sidebar--item ${
                      name === sidebarActiveComponent.value ? 'skeleton__sidebar--item-selected' : ''
                    }`}
                    onClick={() => toggleSidebarActive(name)}
                    onMouseenter={() => toggleSidebarFocus(plugin)}
                    onMouseleave={() => toggleSidebarFocus()}
                  >
                    {typeof iconName === 'string' ? (
                      <Icon name={iconName} class="skeleton__sidebar--icon" />
                    ) : (
                      <iconName />
                    )}
                  </div>
                </>
              )
            })}
          </div>
        )
      }

      if (layout === SkeletonLayouts.SETTERS) {
        if (_plugins.length > 1) {
          console.warn(`SkeletonLayouts.SETTERS expects to use only one plugin and only display the first one!`)
        }

        const Component = _plugins[0]!.component as DefineComponent
        rows = 20
        rowsWidth = ['200px']

        return (
          <>
            <Skeleton v-show={Boolean(loading.value)} loading={Boolean(loading.value)} {...{ rows, rowsWidth }} />

            <Component v-show={Boolean(!loading.value)} />
          </>
        )
      }

      if (layout === SkeletonLayouts.DESIGNER) {
        if (_plugins.length > 1) {
          console.warn(`SkeletonLayouts.DESIGNER expects to use only one plugin and only display the first one!`)
        }

        rows = 10
        rowsWidth = ['100%']

        const Component = _plugins[0]!.component as DefineComponent

        return (
          <>
            <Skeleton v-show={Boolean(loading.value)} loading={Boolean(loading.value)} {...{ rows, rowsWidth }} />

            <Component v-show={Boolean(!loading.value)} />
          </>
        )
      }

      return (
        <>
          <div v-show={Boolean(loading.value)}>
            <Skeleton loading={Boolean(loading.value)} {...{ rows, rowsWidth }} />
          </div>

          <Space v-show={Boolean(!loading.value)}>
            {_plugins.map((_plugin) => {
              const Component = _plugin!.component as DefineComponent
              return <Component />
            })}
          </Space>
        </>
      )
    }

    const RenderHeader: () => JSX.Element = () => {
      const Left = pickerComponents(SkeletonLayouts.HEADER_LEFT)
      const Center = pickerComponents(SkeletonLayouts.HEADER_CENTER)
      const Right = pickerComponents(SkeletonLayouts.HEADER_RIGHT)

      return (
        <AppBar class="skeleton__header" title-position="center">
          {{
            left: () => Left,
            default: () => Center,
            right: () => Right,
          }}
        </AppBar>
      )
    }

    const RenderSideBar: () => JSX.Element = () => {
      const Top = pickerComponents(SkeletonLayouts.SIDEBAR_TOP)
      const Bottom = pickerComponents(SkeletonLayouts.SIDEBAR_BOTTOM)

      const RenderSidebarPlugin: () => JSX.Element = () => {
        return (
          <div>
            {plugins
              .filter((plugin) => plugin.layout.includes('sidebar'))
              .map((plugin) => {
                const RenderPlugin = plugin.component as DefineComponent

                const RenderLabel: () => JSX.Element = () => {
                  return (
                    <Space justify="space-between" class="skeleton__sidebar-component-label">
                      <h2>{plugin?.label || ''}</h2>
                      <Icon
                        onClick={() => {
                          sidebarPinned.value = !sidebarPinned.value
                        }}
                        name="pin-outline"
                      ></Icon>
                    </Space>
                  )
                }

                return (
                  <div
                    v-Show={sidebarActiveComponent.value === plugin.name}
                    class={`skeleton__sidebar-component ${
                      sidebarPinned.value ? 'skeleton__sidebar-component--pinned' : ''
                    }`}
                  >
                    {RenderLabel()}
                    <RenderPlugin />
                  </div>
                )
              })}
          </div>
        )
      }

      return (
        <div class="skeleton__sidebar">
          <div class="skeleton__sidebar--tools">
            {Top}
            {Bottom}
            <Teleport to="body">
              {sidebarFocusComponent.value?.label ? (
                <div style={transitionStyle.value} class="skeleton__sidebar--tooltip">
                  {sidebarFocusComponent.value.label}
                </div>
              ) : null}
            </Teleport>
          </div>
          {RenderSidebarPlugin()}
        </div>
      )
    }

    const RenderDesigner: () => JSX.Element = () => {
      const Designer = pickerComponents(SkeletonLayouts.DESIGNER)

      return <div class="skeleton__designer">{Designer}</div>
    }

    const RenderSetters: () => JSX.Element = () => {
      const Setters = pickerComponents(SkeletonLayouts.SETTERS)

      return <div class="skeleton__setters">{Setters}</div>
    }

    const RenderContent: () => JSX.Element = () => {
      return (
        <div class="skeleton__content">
          {RenderSideBar()}
          {RenderDesigner()}
          {RenderSetters()}
        </div>
      )
    }

    return () => {
      return (
        <div class="skeleton">
          {RenderHeader()}
          {RenderContent()}
        </div>
      )
    }
  },
})
