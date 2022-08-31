import { defineComponent, Ref, ref, watch } from 'vue'
import { eventsManager } from '@varlet/lowcode-core'
import { Input as VarInput } from '@varlet/ui'
import '@varlet/ui/es/input/style/index.js'

export default defineComponent({
  name: 'COUNTERSETTER',
  props: {
    setter: {
      type: Object,
    },
  },
  setup(props) {
    const setter: Ref<any> = ref()
    setter.value = { ...props.setter }
    let marginString: any = ref()
    marginString = setter.value.defaultValue.split(' ')
    const obj = ref({
      top: '1px',
      right: '3px',
      bottom: '4px',
      left: '2px',
    })
    watch(
      obj.value,
      (newValue) => {
        console.log(newValue, 'newValue')
        // eventsManager.emit('setter-value-change', newValue)
      },
      { deep: true }
    )

    return () => {
      return (
        <div>
          <div class="varlet-low-code-field-body">
            <div class="varlet-low-code-field-body-title">上间距</div>
            <div class="varlet-low-code-field-body-content varlet-low-code-field-body__content-style">
              <VarInput v-model={obj.value.top} />
            </div>
          </div>
          <div class="varlet-low-code-field-body">
            <div class="varlet-low-code-field-body-title">右间距</div>
            <div class="varlet-low-code-field-body-content varlet-low-code-field-body__content-style">
              <VarInput v-model={obj.value.right} />
            </div>
          </div>
          <div class="varlet-low-code-field-body">
            <div class="varlet-low-code-field-body-title">下间距</div>
            <div class="varlet-low-code-field-body-content varlet-low-code-field-body__content-style">
              <VarInput v-model={obj.value.bottom} />
            </div>
          </div>
          <div class="varlet-low-code-field-body">
            <div class="varlet-low-code-field-body-title">左间距</div>
            <div class="varlet-low-code-field-body-content varlet-low-code-field-body__content-style">
              <VarInput v-model={obj.value.left} />
            </div>
          </div>
        </div>
      )
    }
  },
})
