import type { DefineComponent, Ref } from 'vue'
import { computed, defineComponent, ref, Teleport, watch } from 'vue'
import { AppBar, Icon, Ripple, Skeleton, Space } from '@varlet/ui'
import { pluginsManager, eventsManager, SkeletonLayouts, SkeletonPlugin } from '@varlet/lowcode-core'
import { getTop } from './shared'
import '@varlet/ui/es/app-bar/style/index.js'
import '@varlet/ui/es/icon/style/index.js'
import '@varlet/ui/es/space/style/index.js'
import '@varlet/ui/es/skeleton/style/index.js'
import '@varlet/ui/es/ripple/style/index'
import './skeleton.less'
import { useLoading } from './useLoading'
import { SkeletonEvents } from './types'

function distributePlugins(plugins: SkeletonPlugin[]) {
  const headerLeftPlugins: SkeletonPlugin[] = []
  const headerCenterPlugins: SkeletonPlugin[] = []
  const headerRightPlugins: SkeletonPlugin[] = []
  const sidebarTopPlugins: SkeletonPlugin[] = []
  const sidebarBottomPlugins: SkeletonPlugin[] = []
  const designerPlugin: SkeletonPlugin[] = []
  const settersPlugin: SkeletonPlugin[] = []

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
      designerPlugin.push(plugin)
      return
    }

    if (plugin.layout === SkeletonLayouts.SETTERS) {
      settersPlugin.push(plugin)
    }
  })

  if (!designerPlugin.length) {
    throw new Error(`${SkeletonLayouts.DESIGNER} must have one plugin !`)
  }

  if (designerPlugin.length > 1) {
    console.warn(`${SkeletonLayouts.DESIGNER} expects to use only one plugin and only display the first one!`)
  }

  if (!settersPlugin.length) {
    throw new Error(`${SkeletonLayouts.SETTERS} must have one plugin !`)
  }

  if (settersPlugin.length > 1) {
    console.warn(`${SkeletonLayouts.SETTERS} expects to use only one plugin and only display the first one!`)
  }

  return {
    headerLeftPlugins,
    headerCenterPlugins,
    headerRightPlugins,
    sidebarTopPlugins,
    sidebarBottomPlugins,
    designerPlugin,
    settersPlugin,
  }
}

export default defineComponent({
  name: 'VarletLowCodeSkeleton',
  directives: { ripple: Ripple },
  setup() {
    const plugins = pluginsManager.exportSkeletonPlugins()
    const {
      headerLeftPlugins,
      headerCenterPlugins,
      headerRightPlugins,
      sidebarTopPlugins,
      sidebarBottomPlugins,
      designerPlugin,
      settersPlugin,
    } = distributePlugins(plugins)
    const sidebarPinned = ref(false)
    const sidebarActiveComponent: Ref<string | undefined> = ref()
    const sidebarFocusComponent: Ref<SkeletonPlugin | undefined> = ref()
    const { layoutLoadingsComputed } = useLoading()
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
      () => sidebarActiveComponent.value,
      (newVal) => {
        eventsManager.emit(SkeletonEvents.SIDEBAR_TOGGLE, { name: newVal })
      }
    )

    const toggleSidebarActive = (name: string) => {
      sidebarActiveComponent.value = name === sidebarActiveComponent.value ? undefined : name
    }

    const toggleSidebarFocus = (plugin?: SkeletonPlugin) => {
      sidebarFocusComponent.value = plugin || undefined
    }

    const renderHeader: () => JSX.Element = () => {
      const renderPlugins: (_plugins: SkeletonPlugin[], loading: boolean) => JSX.Element = (_plugins, loading) => {
        return (
          <>
            <Skeleton v-show={loading} loading={loading} rows="1" />

            <Space v-show={!loading}>
              {_plugins.length
                ? _plugins.map((_plugin) => {
                    const Component = _plugin!.component as DefineComponent
                    const componentProps = {
                      name: _plugin.name,
                      ...(_plugin.componentProps ?? {}),
                    }

                    return <Component {...componentProps} />
                  })
                : null}
            </Space>
          </>
        )
      }

      return (
        <AppBar class="varlet-low-code-skeleton__header" title-position="center" elevation={false}>
          {{
            left: () => renderPlugins(headerLeftPlugins, layoutLoadingsComputed.value.enableHeaderLeftLayout),
            default: () => renderPlugins(headerCenterPlugins, layoutLoadingsComputed.value.enableHeaderCenterLayout),
            right: () => renderPlugins(headerRightPlugins, layoutLoadingsComputed.value.enableHeaderRightLayout),
          }}
        </AppBar>
      )
    }

    const renderSideBar: () => JSX.Element = () => {
      const renderIcons: (_plugins: SkeletonPlugin[], loading: boolean) => JSX.Element = (_plugins, loading) => {
        return (
          <div class="varlet-low-code-skeleton__sidebar--container">
            {_plugins.length
              ? _plugins.map((plugin: SkeletonPlugin) => {
                  const { name } = plugin
                  const iconName = plugin.layoutProps?.icon
                  return (
                    <>
                      <Skeleton v-show={loading} loading={loading} avatar rows="0" />

                      <div
                        v-ripple
                        ref={(el) => sidebarRef(el, name)}
                        v-show={!loading}
                        class={`varlet-low-code-skeleton__sidebar--item ${
                          name === sidebarActiveComponent.value
                            ? 'varlet-low-code-skeleton__sidebar--item-selected'
                            : ''
                        }`}
                        onClick={() => toggleSidebarActive(name)}
                        onMouseenter={() => toggleSidebarFocus(plugin)}
                        onMouseleave={() => toggleSidebarFocus()}
                      >
                        {typeof iconName === 'string' ? (
                          <Icon name={iconName} class="varlet-low-code-skeleton__sidebar--icon" />
                        ) : (
                          <iconName />
                        )}
                      </div>
                    </>
                  )
                })
              : null}
          </div>
        )
      }

      const renderSidebarPlugins: () => JSX.Element = () => {
        const sidebarPlugins = [...sidebarTopPlugins, ...sidebarBottomPlugins]

        return (
          <div
            class={`varlet-low-code-skeleton__sidebar-component ${
              sidebarPinned.value ? 'varlet-low-code-skeleton__sidebar-component--pinned' : ''
            }`}
            style={{
              padding: `${layoutLoadingsComputed.value.enableSidebarPluginLayout ? '14px' : undefined}`,
            }}
            v-show={sidebarActiveComponent.value}
          >
            <Skeleton
              v-Show={layoutLoadingsComputed.value.enableSidebarPluginLayout}
              loading={layoutLoadingsComputed.value.enableSidebarPluginLayout}
              card
              rows="0"
            />
            <div>
              {sidebarPlugins.length
                ? sidebarPlugins.map((plugin) => {
                    const Component = plugin.component as DefineComponent
                    const componentProps = {
                      name: plugin.name,
                      ...(plugin.componentProps ?? {}),
                    }

                    const renderLabel: () => JSX.Element = () => {
                      return (
                        <div class="varlet-low-code-skeleton__sidebar-component-label">
                          <h2>{plugin?.layoutProps?.label || ''}</h2>
                          <Icon
                            onClick={() => {
                              sidebarPinned.value = !sidebarPinned.value
                            }}
                            transition="200"
                            name="pin-outline"
                          ></Icon>
                        </div>
                      )
                    }
                    return (
                      <div
                        v-Show={sidebarActiveComponent.value === plugin.name}
                        class={`
                      ${
                        sidebarActiveComponent.value && layoutLoadingsComputed.value.enableSidebarPluginLayout
                          ? 'varlet-low-code-skeleton__sidebar-component--loading'
                          : ''
                      }
                      `}
                      >
                        {renderLabel()}
                        <Component {...componentProps} />
                      </div>
                    )
                  })
                : null}
            </div>
          </div>
        )
      }

      return (
        <div class="varlet-low-code-skeleton__sidebar">
          <div class="varlet-low-code-skeleton__sidebar--tools">
            {renderIcons(sidebarTopPlugins, layoutLoadingsComputed.value.enableSidebarTopLayout)}
            {renderIcons(sidebarBottomPlugins, layoutLoadingsComputed.value.enableSidebarBottomLayout)}
            <Teleport to="body">
              {sidebarFocusComponent.value?.layoutProps?.label ? (
                <div style={transitionStyle.value} class="varlet-low-code-skeleton__sidebar--tooltip">
                  {sidebarFocusComponent.value.layoutProps.label}
                </div>
              ) : null}
            </Teleport>
          </div>
          {renderSidebarPlugins()}
        </div>
      )
    }

    const renderDesigner: () => JSX.Element = () => {
      const Component = designerPlugin[0]!.component as DefineComponent
      const componentProps = {
        name: designerPlugin[0]!.name,
        ...(designerPlugin[0]!.componentProps ?? {}),
      }

      return (
        <div class="varlet-low-code-skeleton__designer">
          <Skeleton
            v-show={layoutLoadingsComputed.value.enableDesignerLayout}
            loading={layoutLoadingsComputed.value.enableDesignerLayout}
            card
            rows="0"
          />
          <Component {...componentProps} v-show={!layoutLoadingsComputed.value.enableDesignerLayout} />
        </div>
      )
    }

    const renderSetters: () => JSX.Element = () => {
      const Component = settersPlugin[0]!.component as DefineComponent
      const componentProps = {
        name: settersPlugin[0]!.name,
        ...(settersPlugin[0]!.componentProps ?? {}),
      }

      return (
        <div class="varlet-low-code-skeleton__setters">
          <Skeleton
            v-show={layoutLoadingsComputed.value.enableSettersLayout}
            loading={layoutLoadingsComputed.value.enableSettersLayout}
            rows="20"
            rowsWidth={['200px']}
          />

          <Component {...componentProps} v-show={!layoutLoadingsComputed.value.enableSettersLayout} />
        </div>
      )
    }

    const renderContent: () => JSX.Element = () => {
      return (
        <div class="varlet-low-code-skeleton__content">
          {renderSideBar()}
          {renderDesigner()}
          {renderSetters()}
        </div>
      )
    }

    return () => {
      return (
        <div class="varlet-low-code-skeleton">
          {renderHeader()}
          {renderContent()}
        </div>
      )
    }
  },
})
