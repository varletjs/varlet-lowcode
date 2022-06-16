import App from './App.vue'
import { createApp } from 'vue'
import { pluginsManager } from '@varlet/lowcode-core'

import Logo from './Logo.vue'
import Star from './Star.vue'
import Side1 from './Side1.vue'
import Side2 from './Side2.vue'

pluginsManager
  .useSkeletonPlugin({
    component: Logo,
    name: '1',
    layout: 'header-left',
  })
  .useSkeletonPlugin({
    component: Star,
    name: '1111',
    layout: 'header-left',
  })
  .useSkeletonPlugin({
    component: Logo,
    name: '11',
    layout: 'header-left',
  })
  .useSkeletonPlugin({
    layout: 'header-center',
    name: '2',
    component: Logo,
  })
  .useSkeletonPlugin({
    layout: 'header-right',
    name: '3',
    component: Logo,
  })
  .useSkeletonPlugin({
    layout: 'header-right',
    name: '333',
    component: Logo,
  })
  .useSkeletonPlugin({
    layout: 'sidebar-top',
    icon: 'star',
    name: '4',
    component: Side1,
    label: 'label1',
  })
  .useSkeletonPlugin({
    layout: 'sidebar-top',
    icon: 'star',
    name: '44',
    component: Side2,
    label: 'label2',
  })
  .useSkeletonPlugin({
    layout: 'sidebar-bottom',
    icon: Star,
    component: Side2,
    name: '5',
  })

const app = createApp(App)

app.mount('#app')
