import { Dialog as VarDialog, Snackbar } from '@varlet/ui'
import { defineComponent, Teleport, computed, ref, Ref, reactive } from 'vue'
import BindTypePopover from '../bind-type/index'
import BindDialog from '../dialog-setter/index'
// import Monaco from '@varlet/lowcode-monaco'
import { schemaManager } from '@varlet/lowcode-core'
import { createParser } from '@varlet/lowcode-parser'
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
    const { traverseFunction } = createParser()
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
    console.log(selectCategory, selectItemData)
    const propsDetail = reactive([
      {
        name: 'title',
        description: '标题',
        setterType: 'Setter',
        setter: [
          {
            type: 'InputSetter',
            value: '789',
          },
        ],
      },
      {
        name: 'titleChildren',
        description: '表头说明',
        setterType: 'Setter',
        setter: [
          {
            type: 'SwitchInputSetter',
            value: '789',
          },
        ],
      },
      {
        name: 'ripple',
        description: '开启插槽',
        setterType: 'Setter',
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
        setterType: 'Setter',
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
        setterType: 'Setter',
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
    const showDialog = ref(false)
    const openBindDialog = (val: string) => {
      console.log(val)
      showDialog.value = true
    }
    const saveCode = () => {
      try {
        console.log(1)
      } catch (e: any) {
        Snackbar.error(e.toString())
      }
    }
    const dialogContent = () => {
      return (
        <div class="varlet-low-code-variable-bind__content">
          <div class="varlet-low-code-variable-bind__content-props">
            {propsDetail.map((item: any) => {
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
                      v-model={item.setterType}
                      options={item.options ?? undefined}
                      onSelectVariable={() => openBindDialog('showCode')}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <BindDialog v-model={showDialog.value} v-model:code={code.value} />
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
          <div class="min-dialog">
            <VarDialog.Component
              v-model:show={show.value}
              v-slots={childrenSlot}
              onConfirm={saveCode}
            ></VarDialog.Component>
          </div>
        </Teleport>
      )
    }
  },
})
