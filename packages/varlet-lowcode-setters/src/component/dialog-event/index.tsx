import { Dialog as VarDialog, Snackbar } from '@varlet/ui'
import Monaco from '@varlet/lowcode-monaco'
import { defineComponent, Teleport, computed, ref, Ref, reactive, watchEffect } from 'vue'
// import { schemaManager } from '@varlet/lowcode-core'
// import { createAst } from '@varlet/lowcode-ast'
import '@varlet/ui/es/dialog/style/index.js'
import '@varlet/ui/es/snackbar/style/index.js'
import './index.less'

const testProps = {
  onClick: () => {},
  onChange: () => {},
  onMove: () => {},
  delete: '',
}

export default defineComponent({
  name: 'DIALOGSETTER',
  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
    code: {
      type: String,
      default: '',
    },
    attr: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  emits: ['update:modelValue', 'update:code', 'Confirm'],
  setup(props, { emit }) {
    const code: Ref<string> = ref('')
    const show = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit('update:modelValue', val)
      },
    })
    watchEffect(() => {
      if (show.value) {
        code.value = props.code
      }
    })
    const selectIndex = ref('')
    const selectItemData: string[] = reactive([])
    const saveCode = () => {
      try {
        emit('update:code', code.value)
        emit('Confirm', code.value)
      } catch (e: any) {
        Snackbar.error(e.toString())
      }
    }
    const saveItems = (val: string) => {
      if (selectIndex.value === 'ref' || selectIndex.value === 'computed') {
        val += '.value'
      }
      code.value += val
    }
    const dialogContent = () => {
      return (
        <div class="varlet-low-code-variable-bind__content">
          <div class="varlet-low-code-variable-bind__left">
            <div class="varlet-low-code-variable-bind__title">变量列表</div>
            <div class="varlet-low-code-variable-bind__select">
              <div class="varlet-low-code-variable-bind__category">
                <div class={'active'}>组件事件</div>
              </div>
              <div class="varlet-low-code-variable-bind__select-items">
                {selectItemData.map((item) => {
                  return <div onClick={() => saveItems(item)}>{item}</div>
                })}
              </div>
            </div>
          </div>
          <div class="varlet-low-code-variable-bind__right">
            <div class="varlet-low-code-variable-bind__title">绑定</div>
            <Monaco height="calc(100% - 24px)" v-model:code={code.value} onSave={saveCode} />
          </div>
        </div>
      )
    }
    const childrenSlot = {
      default: () => {
        return dialogContent()
      },
      title: () => {
        return <div>变量绑定</div>
      },
    }
    return () => {
      return (
        <Teleport to="body">
          <VarDialog.Component
            v-model:show={show.value}
            v-slots={childrenSlot}
            onConfirm={saveCode}
          ></VarDialog.Component>
        </Teleport>
      )
    }
  },
})
