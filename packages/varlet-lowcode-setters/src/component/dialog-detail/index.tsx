import { Dialog as VarDialog, Snackbar } from '@varlet/ui'
import { defineComponent, Teleport, computed, ref, Ref, reactive } from 'vue'
import BindTypePopover from '../bind-type/index.vue'
import Monaco from '@varlet/lowcode-monaco'
import { schemaManager } from '@varlet/lowcode-core'
import { createAst } from '@varlet/lowcode-ast'
import Component from '../../built-in-setters/index'
import '@varlet/ui/es/dialog/style/index.js'
import '@varlet/ui/es/snackbar/style/index.js'
import './index.less'

export default defineComponent({
  name: 'DIALOGDETAIL',
  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue', 'Confirm'],
  setup(props, { emit }) {
    const NOOP_SETUP = 'function setup() {\n  return {\n}\n}'
    const schema = schemaManager.exportSchema()
    const codeSelect: Ref<string> = ref(schema.code ?? NOOP_SETUP)
    const { traverseFunction } = createAst()
    const { returnDeclarations } = traverseFunction(codeSelect.value)
    const code: Ref<string> = ref('')
    const show = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit('update:modelValue', val)
      },
    })

    const selectIndex = ref('')
    let selectItemData: string[] = reactive([])
    const selectCategory = (val: string) => {
      selectIndex.value = val
      selectItemData = returnDeclarations[val]
    }
    const propsDetail = reactive([
      {
        name: 'title',
        description: '卡片标题',
        setter: [
          {
            type: 'InputSetter',
            value: '789',
          },
        ],
      },
      {
        name: 'titleChildren',
        description: '子标题',
        setter: [
          {
            type: 'SwitchInputSetter',
            value: '789',
          },
        ],
      },
      {
        name: 'ripple',
        description: '开启水波',
        setter: [
          {
            type: 'SwitchSetter',
            value: true,
          },
        ],
      },
      {
        name: 'padding',
        description: '区块行距',
        setter: [
          {
            type: 'CounterSetter',
            value: 12,
          },
        ],
      },
      {
        name: 'widthType',
        description: '宽度类型',
        setter: [
          {
            type: 'RadioSetter',
            options: [
              {
                value: '自适应',
                label: 'adaptive',
              },
              {
                value: '固定',
                label: 'fixed',
              },
            ],
            value: 'adaptive',
          },
        ],
      },
    ])
    const formData = reactive({
      isShowType: 'Setter',
    })
    const openBindDialog = (val: string) => {
      console.log(val)
    }
    const saveCode = () => {
      try {
        console.log(1)
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
    const isBindVariable = ref(false)
    const dialogContent = () => {
      return (
        <div class="varlet-low-code-variable-bind__content">
          <div class="varlet-low-code-variable-bind__content-props">
            {propsDetail.map((item) => {
              return (
                <div class="varlet-low-code-field__body">
                  <div class="varlet-low-code-field__body-title">{item.description}</div>
                  <div class="varlet-low-code-field__body-content">
                    {item.setter.map((itemSetter: any, index: number) => {
                      const setterTypeComponents = Component.filter(
                        (itemComponent) => itemComponent.name === itemSetter.type
                      )
                      const SetterComponent = setterTypeComponents[setterTypeComponents.length - 1]!.component
                      return (
                        <SetterComponent
                          v-model={itemSetter.value}
                          options={itemSetter.options ?? undefined}
                          style={{ marginLeft: index > 0 ? '10px' : 0 }}
                        />
                      )
                    })}
                    <BindTypePopover
                      class="varlet-low-code-field__body-setter-icon"
                      v-model={formData.isShowType}
                      onSelectVariable={() => openBindDialog('showCode')}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div class="varlet-low-code-variable-bind__content-variable">
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
            <div class={`${isBindVariable.value ? 'varlet-low-code-variable-bind__show' : null}`}></div>
          </div>
        </div>
      )
    }
    const childrenSlot = {
      default: () => {
        return dialogContent()
      },
      title: () => {
        return <div>项目</div>
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
