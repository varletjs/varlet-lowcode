import { defineComponent } from 'vue'
import { Icon } from '@varlet/ui'

export default defineComponent({
  name: 'VarletLowCodeSelector',
  setup() {
    return () => {
      return (
        <div class="f-a-c varlet-lowcode-setters-header-path">
          <img
            src="https://alifd.oss-cn-hangzhou.aliyuncs.com/fusion-cool/icons/icon-light/ic_light_table.png"
            alt=""
            style={{ width: '16px', height: '16px', marginRight: '5px' }}
          />
          <span class="header-path-title hover">页面</span>
          <Icon name="chevron-right" />
          <span class="header-path-title hover">页面</span>
          <Icon name="chevron-right" />
          <span class="header-path-title">区域</span>
        </div>
      )
    }
  },
})
