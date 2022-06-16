import type { Ref } from 'vue'
import { defineComponent, ref, computed } from 'vue'
import { AppBar, Icon, Space } from '@varlet/ui'
import { pluginsManager } from '@varlet/lowcode-core'
import { SkeletonLayouts, SkeletonPlugin } from '@varlet/lowcode-core/src/modules/plugins'
import '@varlet/ui/es/app-bar/style/index.js'
import '@varlet/ui/es/icon/style/index.js'
import '@varlet/ui/es/space/style/index.js'
import './skeleton.less'

export default defineComponent({
  name: 'Skeleton',
  setup() {
    const plugins = pluginsManager.exportSkeletonPlugins()

    return () => {
      const pickerComponents = (layout: SkeletonLayouts) => {
        const _plugins: SkeletonPlugin[] = plugins.filter((plugin) => plugin.layout === layout)

        if (!_plugins || _plugins.length === 0) {
          throw new Error(`${layout} is not a valid layout`)
        }

        if (layout.includes('header')) {
          return (
            <Space>
              {_plugins.map(({ component: Component }: SkeletonPlugin) => (
                <Component />
              ))}
            </Space>
          )
        }

        if (layout.includes('sidebar')) {
          return (
            <Space direction={'column'}>
              {_plugins.map(({ icon, name }: SkeletonPlugin) =>
                typeof icon === 'string' ? (
                  <Icon name={icon} onClick={() => toggleSidebarComponent(name)} />
                ) : (
                  <icon onClick={() => toggleSidebarComponent(name)} />
                )
              )}
            </Space>
          )
        }

        return null
      }

      const renderHeader = () => {
        const Left = pickerComponents(SkeletonLayouts.HEADER_LEFT)
        const Center = pickerComponents(SkeletonLayouts.HEADER_CENTER)
        const Right = pickerComponents(SkeletonLayouts.HEADER_RIGHT)

        return (
          <AppBar title-position={'center'}>
            {{
              left: () => Left,
              default: () => Center,
              right: () => Right,
            }}
          </AppBar>
        )
      }

      const sidebarComponentName: Ref<string | undefined> = ref()

      const toggleSidebarComponent = (name: string) => {
        sidebarComponentName.value = name === sidebarComponentName.value ? undefined : name
      }

      const sidebarPinned = ref(false)

      const sidebarComponent = computed(() => {
        if (!sidebarComponentName.value) return null
        const _plugin = plugins.find((plugin) => plugin.name === sidebarComponentName.value)
        const renderPlugin = _plugin!.component

        const renderLabel = () => {
          return (
            <Space justify={'space-between'}>
              {_plugin?.label ? <div>{_plugin?.label}</div> : ''}
              <Icon
                onClick={() => {
                  sidebarPinned.value = !sidebarPinned.value
                }}
                name={'pin-outline'}
              ></Icon>
            </Space>
          )
        }

        return (
          <div class={sidebarPinned.value ? 'sidebarComponent sidebarComponent-pinned' : 'sidebarComponent'}>
            <renderLabel />
            <renderPlugin />
          </div>
        )
      })

      const renderSideBar = () => {
        const Top = pickerComponents(SkeletonLayouts.SIDEBAR_TOP)
        const Bottom = pickerComponents(SkeletonLayouts.SIDEBAR_BOTTOM)
        return (
          <div class="sidebar">
            <Space direction="column" align="center" justify="space-between">
              {Top}
              {Bottom}
            </Space>
            {sidebarComponent.value}
          </div>
        )
      }

      const renderContent = () => {
        return (
          <div class="content">
            <renderSideBar />
            <div class="drawing-board">drawing-board</div>
          </div>
        )
      }

      return (
        <div class="main">
          <div class="skeleton">
            <renderHeader />
            <renderContent />
          </div>
        </div>
      )
    }
  },
})
