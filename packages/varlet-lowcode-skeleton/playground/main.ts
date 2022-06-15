import App from './App.vue'
import { createApp } from 'vue'
import { pluginsManager } from '@varlet/lowcode-core'

import Logo from './Logo.vue'
import Icon from './Icon.vue'
import Side1 from './Side1.vue'
import Side2 from './Side2.vue'

pluginsManager
  .useSkeletonPlugin({
    component: Logo,
    name: '1',
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
    layout: 'sidebar-top',
    icon: 'star',
    name: '4',
    component: Side1,
  })
  .useSkeletonPlugin({
    layout: 'sidebar-bottom',
    icon: Icon,
    component: Side2,
    name: '5',
  })

const app = createApp(App)

app.mount('#app')
