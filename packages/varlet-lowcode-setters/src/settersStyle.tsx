import { eventsManager } from '@varlet/lowcode-core'
import type { CSSProperties, Ref } from 'vue'
import { onMounted, onUnmounted, defineComponent, ref } from 'vue'
import { Icon } from '@varlet/ui'
import StyleInput from './settersStyle/styleInput'
import StyleSwitch from './settersStyle/styleSwitch'

export default defineComponent({
  name: 'SettersStyle',
  setup() {
    const testText = ref('123456')
    const testBol = ref(true)
    const testArr = ref([{}, {}])
    return () => {
      return (
        <div class="setters-style-field">
          <div class="style-field-head">
            <span>样式</span>
            <Icon name="chevron-down" />
          </div>
          <div class="style-field-body">
            <div class="style-field-body-title">区块模式</div>
            <div class="style-field-body-content">
              <StyleInput v-model={testText.value} />
              <Icon name="dots-vertical" />
            </div>
          </div>
          <div class="style-field-body">
            <div class="style-field-body-title">头部分割线</div>
            <div class="style-field-body-content">
              <StyleSwitch v-model={testBol.value} />
              <Icon name="dots-vertical" />
            </div>
          </div>
        </div>
      )
    }
  },
})
