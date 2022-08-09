<script lang="ts" setup>
import { ref, onUnmounted, onMounted, nextTick } from 'vue'
import { BuiltInEvents, eventsManager, schemaManager } from '@varlet/lowcode-core'
import { Button as VarButton, Divider as VarDivider, Dialog } from '@varlet/ui'
import DataSourceModal from './DataSourceModal.vue'
import '@varlet/ui/es/button/style/index.js'
import '@varlet/ui/es/divider/style/index.js'
import type { SchemaPageNode, SchemaPageNodeDataSource } from '@varlet/lowcode-core'

const modalShow = ref<boolean>(false)

const formData = ref<SchemaPageNodeDataSource>({
  name: '',
  url: '',
  method: 'get',
  description: '',
  headers: {},
  timeout: 5000,
  withCredentials: true,
  successHandler: '',
  errorHandler: '',
})

let schema = schemaManager.exportSchema()

const dataSources = ref(schema.dataSources || [])
dataSources.value = [
  {
    name: 'name_1',
    url: '/url_1',
    method: 'optionsArrayBuffer',
    description: 'description_1',
    headers: {},
    timeout: 1000,
    withCredentials: true,
    successHandler: '',
    errorHandler: '',
  },
  {
    name: 'name_2',
    url: '/url_2',
    method: 'get',
    description: 'description_2',
    headers: { token: 'token' },
    timeout: 1000,
    withCredentials: true,
    successHandler: '',
    errorHandler: '',
  },
]

const currentIndex = ref<number>(0)

function editDataSource(dataSource: SchemaPageNodeDataSource, index: number): void {
  currentIndex.value = index
  formData.value = dataSource
  modalShow.value = true
}

async function delDataSource(index: number) {
  const res = await Dialog({ title: '删除确认', message: '是否删除该条数据源' })

  if (res === 'confirm') {
    dataSources.value.splice(index, 1)
  }
}

function handleSchemaChange(newSchema: SchemaPageNode, payload?: any) {
  schema = newSchema
  console.log(schema, '我是schema')
}

async function handleSkeletonSidebarToggle() {
  await nextTick()
}

function updateDataSource(dataSourceForm: SchemaPageNodeDataSource) {
  dataSources.value[currentIndex.value] = dataSourceForm
  saveDataSource()
}

function saveDataSource() {
  schemaManager.importSchema({
    ...schema,
    dataSources: dataSources.value,
  })
}

const getCapital = (str: string): string[] => str.replace(/([A-Z])/, '#$1').split('#')

eventsManager.on(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)

onMounted(() => {
  // eventsManager.on('skeleton-sidebar-toggle', handleSkeletonSidebarToggle)

  saveDataSource()
})

onUnmounted(() => {
  eventsManager.off(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)
})
</script>

<template>
  <div class="varlet-low-code-code-data-source">
    <div class="data-source-header">
      <var-button type="primary">新建</var-button>
    </div>

    <var-divider />

    <div class="data-source-list">
      <div
        v-for="(item, index) in dataSources"
        :key="item.name"
        class="data-source-card"
        @click="editDataSource(item, index)"
      >
        <div class="data-source-card-chip">
          <span v-for="(word, wIndex) in getCapital(item.method)" :key="wIndex">{{ word.toUpperCase() }}</span>
        </div>

        <div class="data-source-card-header">
          <span class="data-source-card-header-title">{{ item.name }}</span>
          <div class="data-source-card-header-action">
            <var-button text type="primary" @click.stop="delDataSource(index)">删除</var-button>
          </div>
        </div>

        <var-divider />

        <div class="data-source-card-description">{{ item.description }}</div>
      </div>
    </div>
  </div>

  <data-source-modal
    :form-data="formData"
    v-model="modalShow"
    @close="modalShow = false"
    @confirm="updateDataSource"
  ></data-source-modal>
</template>

<style lang="less">
.varlet-low-code-code-data-source {
  width: 400px;
  padding: 10px;
  background-color: #fff;

  .data-source-header {
    display: flex;
    justify-content: flex-end;
  }

  .data-source-card {
    position: relative;
    margin-bottom: 8px;
    padding: 8px;
    cursor: pointer;
    border: 1px solid rgba(31, 56, 88, 0.1);
    border-radius: 6px;

    &-chip {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      user-select: none;
      color: #3a7afe20;
      font-size: 40px;
    }

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;

      &-title {
        flex: 1;
        color: #555;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      &-action {
        margin-left: 20px;
      }
    }

    &-description {
      width: 100%;
      min-height: 36px;
      display: flex;
      align-items: center;
      color: rgba(31, 56, 88, 0.7);
      font-size: 14px;
      word-break: break-word;
    }
  }
}

.var-dialog {
  --dialog-width: 40vw;
}
</style>
