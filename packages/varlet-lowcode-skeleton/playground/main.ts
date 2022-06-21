import App from './App.vue'
import { createApp } from 'vue'
import { pluginsManager, SkeletonLayouts } from '@varlet/lowcode-core'

import Logo from './Logo.vue'
import Star from './Star.vue'
import Side1 from './Side1.vue'
import Side2 from './Side2.vue'

pluginsManager
  .useSkeletonPlugin({
    component: Logo,
    name: '1',
    layout: SkeletonLayouts.HEADER_LEFT,
  })
  .useSkeletonPlugin({
    component: Star,
    name: '1111',
    layout: SkeletonLayouts.HEADER_LEFT,
  })
  .useSkeletonPlugin({
    component: Logo,
    name: '11',
    layout: SkeletonLayouts.HEADER_LEFT,
  })
  .useSkeletonPlugin({
    layout: SkeletonLayouts.HEADER_CENTER,
    name: '2',
    component: Logo,
  })
  .useSkeletonPlugin({
    layout: SkeletonLayouts.HEADER_RIGHT,
    name: '3',
    component: Logo,
  })
  .useSkeletonPlugin({
    layout: SkeletonLayouts.HEADER_RIGHT,
    name: '333',
    component: Logo,
  })
  .useSkeletonPlugin({
    layout: SkeletonLayouts.DESIGNER,
    name: 'd',
    component: Logo,
  })
  .useSkeletonPlugin({
    layout: SkeletonLayouts.SIDEBAR_TOP,
    icon: 'star',
    name: '4',
    component: Side1,
    label: 'label1',
  })
  .useSkeletonPlugin({
    layout: SkeletonLayouts.SIDEBAR_TOP,
    icon: 'star',
    name: '44',
    component: Side2,
    label: 'label2',
  })
  .useSkeletonPlugin({
    layout: SkeletonLayouts.SIDEBAR_BOTTOM,
    icon: Star,
    component: Side2,
    name: '5',
  })
  .useSkeletonPlugin({
    layout: SkeletonLayouts.SETTERS,
    name: 's',
    component: Logo,
  })

const app = createApp(App)

app.mount('#app')
