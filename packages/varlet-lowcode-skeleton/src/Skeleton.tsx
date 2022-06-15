import { defineComponent, ref, computed } from 'vue'
import { AppBar, Icon, Space } from '@varlet/ui'
import { pluginsManager } from '@varlet/lowcode-core'
import { SkeletonLayouts } from '@varlet/lowcode-core/src/modules/plugins'
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
        const comps: Array<JSX.Element> = []
        plugins.forEach((plugin) => {
          if (plugin.layout === layout) {
            if (layout.includes('header')) {
              comps.push(plugin.component.render!())
            }

            if (layout.includes('sidebar')) {
              if (typeof plugin.icon === 'string') {
                comps.push(<Icon name={plugin.icon} on-click={() => changeCurrentComponent(plugin.name)} />)
              } else {
                const { icon } = plugin
                comps.push(<icon onClick={() => changeCurrentComponent(plugin.name)} />)
              }
            }
          }
        })
        return comps
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

      const currentComponentName = ref('')
      const changeCurrentComponent = (name: string) => {
        currentComponentName.value = name === currentComponentName.value ? '' : name
      }
      const currentComponent = computed(() => {
        return plugins.find((plugin) => plugin.name === currentComponentName.value)!.component
      })

      const SideBar = () => {
        const Top = pickerComponents(SkeletonLayouts.SIDEBAR_TOP)
        const Bottom = pickerComponents(SkeletonLayouts.SIDEBAR_BOTTOM)
        return (
          <div class={'sidebar'}>
            <Space direction={'column'} align={'center'} justify={'space-between'}>
              {Top}
              {Bottom}
            </Space>
            {currentComponentName.value ? (
              <div
                style={{
                  width: '200px',
                }}
              >
                <currentComponent.value />
              </div>
            ) : (
              ''
            )}
          </div>
        )
      }

      const DrawingBoard = () => {
        return <div class={'drawing-board'} />
      }

      const Container = () => {
        return (
          <div class={'container'}>
            <SideBar />
            <DrawingBoard />
          </div>
        )
      }

      return (
        <div class={'main'}>
          <div class={'skeleton'}>
            <Header />
            <Container />
          </div>
        </div>
      )
    }
  },
})
