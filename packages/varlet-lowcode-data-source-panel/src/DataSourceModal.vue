<script setup lang="ts">
import { ref, watch, PropType, defineEmits, defineProps } from 'vue'
import Monaco from '@varlet/lowcode-monaco'
import {
  Dialog,
  // Button as VarButton,
  Form as VarForm,
  Input as VarInput,
  Select as VarSelect,
  Option as VarOption,
  Row as VarRow,
  Col as VarCol,
  Button as VarButton,
  Icon as VarIcon,
} from '@varlet/ui'
import '@varlet/ui/es/button/style/index.js'
import '@varlet/ui/es/row/style/index.js'
import '@varlet/ui/es/col/style/index.js'

import type { SchemaPageNodeDataSource, BuiltInEvents, eventsManager, schemaManager } from '@varlet/lowcode-core'
import type { Ref } from 'vue'
import type { IRange } from 'monaco-editor'

const VarDialog = Dialog.Component

const props = defineProps({
  modalShow: {
    type: Boolean,
    default: false,
  },
  formData: {
    type: Object as PropType<SchemaPageNodeDataSource>,
    required: true,
  },
})

const dataSourceForm = ref(JSON.parse(JSON.stringify(props.formData)))
const show: Ref<boolean | undefined> = ref(false)
const headersMockList: Ref<any[]> = ref([])

const NOOP_SUCCESS = 'function successHandler() {\n  return {\n}\n}'
const NOOP_ERROR = 'function errorHandler() {\n  return {\n}\n}'

const successHandler: Ref<string> = ref(dataSourceForm.value.successHandler || NOOP_SUCCESS)
const errorHandler: Ref<string> = ref(dataSourceForm.value.errorHandler || NOOP_ERROR)

watch(
  () => props.modalShow,
  (value) => {
    show.value = value
  }
)

watch(
  () => props.formData,
  () => {
    dataSourceForm.value = JSON.parse(JSON.stringify(props.formData))
    updateHeadersMockList()
    updateCallback()
  }
)

const updateCallback = (): void => {
  successHandler.value = dataSourceForm.value.successHandler ?? NOOP_SUCCESS
  errorHandler.value = dataSourceForm.value.errorHandler ?? NOOP_ERROR
}

const updateHeadersMockList = (): void => {
  headersMockList.value = []
  const { headers } = dataSourceForm.value
  for (const key in headers) {
    if (headers.hasOwnProperty(key)) {
      const item = {
        key,
        value: headers[key],
      }
      headersMockList.value.push(item)
    }
  }
}

updateHeadersMockList()

const syncHeadersMockList = (): void => {
  headersMockList.value.forEach((item) => {
    dataSourceForm.value.headers[item.key] = item.value
  })
}

const syncCallback = (): void => {
  dataSourceForm.value.successHandler = successHandler.value
  dataSourceForm.value.errorHandler = errorHandler.value
}

const emits = defineEmits(['close', 'confirm'])

const handleModalClose = (): void => {
  emits('close')
}

const handleModalConfirm = (): void => {
  syncHeadersMockList()
  syncCallback()
  emits('confirm', dataSourceForm.value)
}

const change = (value: string) => {
  console.log(value)
  console.log(dataSourceForm.value.method)
}

const handleAddHeaders = () => {
  headersMockList.value.push({
    key: '',
    value: '',
  })
}

const handleDeleteHeaders = (index: number) => {
  headersMockList.value.splice(index, 1)
}

function createApiSuggestions(range: IRange) {
  return [
    'h',
    'renderList',
    'ref',
    'reactive',
    'computed',
    'readonly',
    'watch',
    'watchEffect',
    'watchSyncEffect',
    'watchPostEffect',
    'isRef',
    'unref',
    'toRefs',
    'isProxy',
    'isReactive',
    'isReadonly',
    'onBeforeMount',
    'onMounted',
    'onBeforeUpdate',
    'onUpdated',
    'onBeforeUnmount',
    'onUnmounted',
    'useDataSources',
  ].map((name) => {
    return {
      label: name,
      kind: 17,
      documentation: `https://github.com/varletjs/varlet-lowcode`,
      insertText: `${name}()`,
      range,
      detail: `vue: ${name}`,
    }
  })
}
</script>

<template>
  <!-- <div class="data-source-modal"> -->
  <var-dialog v-model:show="show" @close="handleModalClose" @confirm="handleModalConfirm">
    <template #title> 数据源 </template>

    <var-form ref="form" class="data-source-modal-form">
      <div class="data-source-modal-form-item">
        <div class="data-source-modal-form-item-label">数据源名称:</div>
        <div class="data-source-modal-form-item-input">
          <var-input
            placeholder="请输入名称"
            :rules="[(v: string) => !!v || '名称不能为空']"
            v-model="dataSourceForm.name"
            :hint="false"
          />
        </div>
      </div>
      <div class="data-source-modal-form-item">
        <div class="data-source-modal-form-item-label">请求地址:</div>
        <div class="data-source-modal-form-item-input">
          <var-input
            placeholder="请输入请求地址"
            :rules="[(v: string) => !!v || '请求地址不能为空']"
            v-model="dataSourceForm.url"
            :hint="false"
          />
        </div>
      </div>
      <div class="data-source-modal-form-item">
        <div class="data-source-modal-form-item-label">请求方法:</div>
        <div class="data-source-modal-form-item-input">
          <var-select placeholder="请选择请求方法" v-model="dataSourceForm.method" @change="change" :hint="false">
            <var-option label="post" />
            <var-option label="get" />
            <var-option label="put" />
            <var-option label="delete" />
          </var-select>
        </div>
      </div>
      <div class="data-source-modal-form-item">
        <div class="data-source-modal-form-item-label">是否支持跨域:</div>
        <div class="data-source-modal-form-item-input">
          <var-select placeholder="请选择是否支持跨域" v-model="dataSourceForm.withCredentials" :hint="false">
            <var-option label="是" :value="true" />
            <var-option label="否" :value="false" />
          </var-select>
        </div>
      </div>
      <div class="data-source-modal-form-item">
        <div class="data-source-modal-form-item-label">超时时长(毫秒):</div>
        <div class="data-source-modal-form-item-input">
          <var-input placeholder="请输入超时时长" v-model.string="dataSourceForm.timeout" :hint="false" />
        </div>
      </div>
      <div class="data-source-modal-form-item row">
        <div class="data-source-modal-form-item-label">请求头信息:</div>
        <div v-for="(item, index) in headersMockList" :key="index" class="data-source-modal-form-item-input">
          <var-row>
            <var-col :span="6">
              <var-input
                placeholder="请输入key"
                :rules="[(v: string) => !!v || 'key不能为空']"
                v-model.string="item.key"
                :hint="false"
              />
            </var-col>
            <var-col :span="2">:</var-col>
            <var-col :span="14">
              <var-input placeholder="请输入value" v-model.string="item.value" :hint="false" />
            </var-col>
            <var-col :span="2">
              <var-button type="danger" size="mini" round @click="handleDeleteHeaders(index)">
                <var-icon name="trash-can-outline" />
              </var-button>
            </var-col>
          </var-row>
          <!-- <var-divider /> -->
        </div>
        <div class="headers-button">
          <var-button type="primary" size="mini" round @click="handleAddHeaders">
            <var-icon name="plus" />
          </var-button>
        </div>
      </div>
      <div class="data-source-modal-form-item row">
        <div class="data-source-modal-form-item-label">成功回调:</div>
        <div class="data-source-modal-form-item-input">
          <monaco
            :create-suggestions="createApiSuggestions"
            height="100px"
            width="100%"
            v-model:code="successHandler"
          />
        </div>
      </div>
    </var-form>
  </var-dialog>
  <!-- </div> -->
</template>

<style lang="less" scoped>
.data-source-modal-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 15px;
  margin-bottom: 8px;
  &-item {
    gap: 20px;
    width: calc(50% - 7.5px);
    &-label {
      font-weight: 500;
      font-size: 13px;
      color: #525f7f;
    }
    &-input {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
    .var-row {
      width: 100%;
      // align-items: center!important;
      margin-bottom: 12px;
    }
    .var-col {
      justify-content: center;
    }
    .headers-button {
      display: flex;
      justify-content: center;
    }
  }
  .row {
    width: 100%;
  }
}
</style>
