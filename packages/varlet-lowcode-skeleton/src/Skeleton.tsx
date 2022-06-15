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
    return () => {
      const plugins = pluginsManager.exportSkeletonPlugins()

      const pickerComponents = (layout: SkeletonLayouts) => {
        const _plugins: SkeletonPlugin[] = plugins.filter((plugin) => plugin.layout === layout)

        if (!_plugins || _plugins.length === 0) {
          throw new Error(`${layout} is not a valid layout`)
        }

        if (layout.includes('header')) {
          return _plugins.map(({ component }: SkeletonPlugin) => component.render!())
        }

        if (layout.includes('sidebar')) {
          return _plugins.map(({ icon, name }: SkeletonPlugin) =>
            typeof icon === 'string' ? (
              <Icon name={icon} on-click={() => changeCurrentComponent(name)} />
            ) : (
              <icon onClick={() => changeCurrentComponent(name)} />
            )
          )
        }

        return []
      }

      const Header = () => {
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

      const currentComponentName: Ref<string | undefined> = ref('')

      const changeCurrentComponent = (name: string) => {
        currentComponentName.value = name === currentComponentName.value ? undefined : name
      }

      const currentComponent = computed(() => {
        if (!currentComponentName.value) return null
        const PluginComponent = plugins.find((plugin) => plugin.name === currentComponentName.value)!.component
        return (
          <div style="width: 200px">
            <PluginComponent />
          </div>
        )
      })

      const SideBar = () => {
        const Top = pickerComponents(SkeletonLayouts.SIDEBAR_TOP)
        const Bottom = pickerComponents(SkeletonLayouts.SIDEBAR_BOTTOM)
        return (
          <div className="sidebar">
            <Space direction="column" align="center" justify="space-between">
              {Top}
              {Bottom}
            </Space>
            {currentComponent.value}
          </div>
        )
      }

      const Container = () => {
        return (
          <div class="container">
            <SideBar />
            <div class="drawing-board" />
          </div>
        )
      }

      return (
        <div class="main">
          <div class="skeleton">
            <Header />
            <Container />
          </div>
        </div>
      )
    }
  },
})
