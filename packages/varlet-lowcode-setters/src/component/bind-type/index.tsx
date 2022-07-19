import Popover from '../popover/popover'
import { Icon } from '@varlet/ui'
import { computed, defineComponent } from 'vue'
import './index.less'

export default defineComponent({
  name: 'BINDTYPE',
  emits: ['update:modelValue', 'SelectVariable'],
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    options: {
      type: Array as any,
      default: () => {
        return [
          {
            value: 'Setter',
            label: 'Setter',
            fn: () => {},
          },
          {
            value: '变量输入',
            label: '变量输入',
            fn: () => {},
          },
        ]
      },
    },
  },
  setup(props, { emit }) {
    const bindType = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit('update:modelValue', val)
      },
    })
    const changeBindType = (val: string, fn: Function) => {
      bindType.value = val
      if (!fn() && val === '变量输入') {
        emit('SelectVariable')
      } else {
        fn()
      }
    }
    const asd = () => {
      // emit('SelectVariable')
    }
    const childrenSlot = {
      default: () => {
        return (
          <div>
            <Icon name="dots-vertical" />
          </div>
        )
      },
      content: () => {
        return (
          <div class="varlet-low-code__popover--select-bind">
            {props.options.map((item: any) => {
              return (
                <div class="varlet-low-code__select--item" onClick={() => changeBindType(item.label, item.fn)}>
                  <Icon
                    name="check"
                    class={bindType.value !== item.label ? 'varlet-low-code__opacity' : ''}
                    color="#2979ff"
                  />
                  {item.value}
                </div>
              )
            })}
          </div>
        )
      },
    }
    return () => {
      return <Popover v-slots={childrenSlot} />
    }
  },
})
