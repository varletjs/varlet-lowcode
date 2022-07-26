import { Dialog as VarDialog, Snackbar } from '@varlet/ui'
import Monaco from '@varlet/lowcode-monaco'
import { defineComponent, Teleport, computed, ref, Ref, reactive, watchEffect } from 'vue'
import { schemaManager } from '@varlet/lowcode-core'
import { createAst } from '@varlet/lowcode-ast'
import '@varlet/ui/es/dialog/style/index.js'
import '@varlet/ui/es/snackbar/style/index.js'
import './index.less'

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
    console.log(emit, 'emit')
    const NOOP_SETUP = 'function setup() {\n  return {\n}\n}'
    const schema = schemaManager.exportSchema()
    const codeSelect: Ref<string> = ref(schema.code ?? NOOP_SETUP)
    const { traverseFunction } = createAst()
    const { returnDeclarations } = traverseFunction(codeSelect.value)
    const slotProps = [`$slotProps['20112512a1sdas4d51as2d'][0].title`, `$slotProps['asdfas123fsa4f58sd45f'][0].title`]
    const render = [
      `$renderArgs['asdasfasfda4sd54as5d4a5sd14'][0].title`,
      `$renderArgs['fdgdfg5fd41g5fd31gd53g14d5'][0].title`,
    ]
    returnDeclarations.slotProps = slotProps
    returnDeclarations.render = render
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
    let selectItemData: string[] = reactive([])
    const selectCategory = (val: string) => {
      selectIndex.value = val
      selectItemData = returnDeclarations[val]
      console.log(returnDeclarations, 'selectItemData')
    }

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
    const selectCategoryContent = () => {
      return Object.keys(returnDeclarations).map((item) => {
        return (
          <div class={selectIndex.value === item ? 'active' : null} onClick={() => selectCategory(item)}>
            {item}
          </div>
        )
      })
    }
    const dialogContent = () => {
      return (
        <div class="varlet-low-code-variable-bind__content">
          <div class="varlet-low-code-variable-bind__left">
            <div class="varlet-low-code-variable-bind__title">变量列表</div>
            <div class="varlet-low-code-variable-bind__select">
              <div class="varlet-low-code-variable-bind__category">{selectCategoryContent()}</div>
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
