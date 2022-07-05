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

function distributePlugins(plugins: SkeletonPlugin[]) {
  const headerLeftPlugins: SkeletonPlugin[] = []
  const headerCenterPlugins: SkeletonPlugin[] = []
  const headerRightPlugins: SkeletonPlugin[] = []
  const sidebarTopPlugins: SkeletonPlugin[] = []
  const sidebarBottomPlugins: SkeletonPlugin[] = []
  const designerPlugins: SkeletonPlugin[] = []
  const settersPlugins: SkeletonPlugin[] = []

  plugins.forEach((plugin) => {
    if (plugin.layout === SkeletonLayouts.HEADER_LEFT) {
      headerLeftPlugins.push(plugin)
      return
    }

    if (plugin.layout === SkeletonLayouts.HEADER_CENTER) {
      headerCenterPlugins.push(plugin)
      return
    }

    if (plugin.layout === SkeletonLayouts.HEADER_RIGHT) {
      headerRightPlugins.push(plugin)
      return
    }

    if (plugin.layout === SkeletonLayouts.SIDEBAR_TOP) {
      sidebarTopPlugins.push(plugin)
      return
    }
    if (plugin.layout === SkeletonLayouts.SIDEBAR_BOTTOM) {
      sidebarBottomPlugins.push(plugin)
      return
    }

    if (plugin.layout === SkeletonLayouts.DESIGNER) {
      designerPlugins.push(plugin)
      return
    }

    if (plugin.layout === SkeletonLayouts.SETTERS) {
      settersPlugins.push(plugin)
    }
  })

  return {
    headerLeftPlugins,
    headerCenterPlugins,
    headerRightPlugins,
    sidebarTopPlugins,
    sidebarBottomPlugins,
    designerPlugins,
    settersPlugins,
  }
}

export default defineComponent({
  name: 'Skeleton',
  directives: { ripple: Ripple },
  setup() {
    const plugins = pluginsManager.exportSkeletonPlugins()
    const {
      headerLeftPlugins,
      headerCenterPlugins,
      headerRightPlugins,
      sidebarTopPlugins,
      sidebarBottomPlugins,
      designerPlugins,
      settersPlugins,
    } = distributePlugins(plugins)
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

    const renderHeader: () => JSX.Element = () => {
      const renderPlugins: (_plugins: SkeletonPlugin[]) => JSX.Element = (_plugins) => {
        return (
          <>
            <div v-show={Boolean(loading.value)}>
              <Skeleton loading={Boolean(loading.value)} rows="1" rowsWidth={['30vw']} />
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

      return (
        <AppBar class="skeleton__header" title-position="center">
          {{
            left: renderPlugins(headerLeftPlugins),
            default: renderPlugins(headerCenterPlugins),
            right: renderPlugins(headerRightPlugins),
          }}
        </AppBar>
      )
    }

    const renderSideBar: () => JSX.Element = () => {
      const renderIcons: (_plugins: SkeletonPlugin[]) => JSX.Element = (_plugins) => {
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

      const renderSidebarPlugins: () => JSX.Element = () => {
        return (
          <div>
            {plugins
              .filter((plugin) => plugin.layout.includes('sidebar'))
              .map((plugin) => {
                const RenderPlugin = plugin.component as DefineComponent

                const renderLabel: () => JSX.Element = () => {
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
                    {renderLabel()}
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
            {renderIcons(sidebarTopPlugins)}
            {renderIcons(sidebarBottomPlugins)}
            <Teleport to="body">
              {sidebarFocusComponent.value?.label ? (
                <div style={transitionStyle.value} class="skeleton__sidebar--tooltip">
                  {sidebarFocusComponent.value.label}
                </div>
              ) : null}
            </Teleport>
          </div>
          {renderSidebarPlugins()}
        </div>
      )
    }

    const renderDesigner: () => JSX.Element = () => {
      if (!designerPlugins.length) {
        throw new Error(`${SkeletonLayouts.DESIGNER} must have one plugin !`)
      }

      if (designerPlugins.length > 1) {
        console.warn(`${SkeletonLayouts.DESIGNER} expects to use only one plugin and only display the first one!`)
      }

      const renderDesignerPlugin = () => {
        const Component = designerPlugins[0]!.component as DefineComponent

        return (
          <>
            <Skeleton v-show={Boolean(loading.value)} loading={Boolean(loading.value)} card rows="0" />
            <Component v-show={Boolean(!loading.value)} />
          </>
        )
      }

      return <div class="skeleton__designer">{renderDesignerPlugin()}</div>
    }

    const renderSetters: () => JSX.Element = () => {
      if (!settersPlugins.length) {
        throw new Error(`${SkeletonLayouts.SETTERS} must have one plugin !`)
      }

      if (settersPlugins.length > 1) {
        console.warn(`${SkeletonLayouts.SETTERS} expects to use only one plugin and only display the first one!`)
      }

      const renderSettersPlugin = () => {
        const Component = settersPlugins[0]!.component as DefineComponent

        return (
          <>
            <Skeleton
              v-show={Boolean(loading.value)}
              loading={Boolean(loading.value)}
              rows="20"
              rowsWidth={['200px']}
            />

            <Component v-show={Boolean(!loading.value)} />
          </>
        )
      }

      return <div class="skeleton__setters">{renderSettersPlugin()}</div>
    }

    const renderContent: () => JSX.Element = () => {
      return (
        <div class="skeleton__content">
          {renderSideBar()}
          {renderDesigner()}
          {renderSetters()}
        </div>
      )
    }

    return () => {
      return (
        <div class="skeleton">
          {renderHeader()}
          {renderContent()}
        </div>
      )
    }
  },
})
