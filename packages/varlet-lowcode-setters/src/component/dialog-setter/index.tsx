import { Dialog as VarDialog, Snackbar } from '@varlet/ui'
import Monaco from '@varlet/lowcode-monaco'
import { defineComponent, Teleport, computed, ref, Ref } from 'vue'
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
    attr: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  setup(props, { emit }) {
    const NOOP_SETUP = 'function setup() {\n  return {\n}\n}'
    const schema = schemaManager.exportSchema()
    const codeSelect: Ref<string> = ref(schema.code ?? NOOP_SETUP)
    const { traverseFunction, transformCompatibleCode } = createAst()
    const { returnDeclarations } = traverseFunction(codeSelect.value)
    console.log(returnDeclarations, 'returnDeclarations')
    const show = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit('update:modelValue', val)
      },
    })
    const selectIndex = ref('')
    const selectCategory = (val: string) => {
      selectIndex.value = val
    }
    const code: Ref<string> = ref('')
    const saveCode = () => {
      try {
        const compatibleCode = transformCompatibleCode(code.value)
        const { returnDeclarations } = traverseFunction(code.value)

        schemaManager.importSchema({
          ...schema,
          setupReturnDeclarations: returnDeclarations,
          code: code.value,
          compatibleCode,
        })
      } catch (e: any) {
        Snackbar.error(e.toString())
      }
    }
    const saveItems = (val: string) => {
      code.value += val
    }
    const dialogContent = () => {
      return (
        <div class="varlet-low-code-variable-bind__content">
          <div class="varlet-low-code-variable-bind__left">
            <div class="varlet-low-code-variable-bind__title">变量列表</div>
            <div class="varlet-low-code-variable-bind__select">
              <div class="varlet-low-code-variable-bind__category">
                {Object.keys(returnDeclarations).map((item) => {
                  return (
                    <div class={selectIndex.value === item ? 'active' : null} onClick={() => selectCategory(item)}>
                      {item}
                    </div>
                  )
                })}
              </div>
              <div class="varlet-low-code-variable-bind__select-items">
                <div onClick={() => saveItems('testRef.value')}>testRef.value</div>
                <div onClick={() => saveItems('testRef2.value')}>testRef2.value</div>
                <div onClick={() => saveItems('testRef3.value')}>testRef3.value</div>
              </div>
            </div>
          </div>
          <div class="varlet-low-code-variable-bind__right">
            <div class="varlet-low-code-variable-bind__title">绑定</div>
            <Monaco language="json" height="calc(100% - 24px)" v-model:code={code.value} onSave={saveCode} />
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
          <VarDialog.Component v-model:show={show.value} v-slots={childrenSlot}></VarDialog.Component>
        </Teleport>
      )
    }
  },
})
