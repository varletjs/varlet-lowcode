<script setup lang="ts">
import { ref, onUnmounted, onMounted, nextTick, computed } from 'vue'
import { BuiltInEvents, eventsManager, schemaManager } from '@varlet/lowcode-core'
import { Button as VarButton, Divider as VarDivider } from '@varlet/ui'
import DataSourceModal from './DataSourceModal.vue'
import '@varlet/ui/es/button/style/index.js'
import '@varlet/ui/es/divider/style/index.js'
import type { SchemaPageNode, SchemaPageNodeDataSource } from '@varlet/lowcode-core'
import { number } from 'yargs'

const modalShow = ref<boolean>(false)

const formData = ref<SchemaPageNodeDataSource>({
  name: '',
  url: '',
  method: 'post',
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
    name: '我是假的数据源我是假的数据源我是假的数据源',
    url: '/aaaaaaaaaaaaaaaaaaa',
    method: 'optionsArrayBuffer',
    description: '这是假的数据源哦',
    headers: {},
    timeout: 1000,
    withCredentials: true,
    successHandler: '',
    errorHandler: '',
  },
  {
    name: '齐皓是个大老鼠',
    url: '/aaaaaaaaaaaaaaaaaaa',
    method: 'get',
    description: '这是假的数据源哦',
    headers: {
      token: '我焯',
    },
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

function delDataSource() {
  //
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

function getCapital(str: string): string[] {
  return str.replace(/([A-Z])/, '#$1').split('#')
}

eventsManager.on(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)

onMounted(() => {
  eventsManager.on('skeleton-sidebar-toggle', handleSkeletonSidebarToggle)

  // updateDataSource()
})

onUnmounted(() => {
  eventsManager.off(BuiltInEvents.SCHEMA_CHANGE, handleSchemaChange)
  eventsManager.off('skeleton-sidebar-toggle', handleSkeletonSidebarToggle)
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
          <div class="data-source-card-chip-word">
            {{ getCapital(item.method)[0].toUpperCase() }}
          </div>
          <div v-if="getCapital(item.method)[1]" class="data-source-card-chip-word">
            {{ getCapital(item.method)[1].toUpperCase() }}
          </div>
        </div>
        <div class="data-source-card-header">
          <div class="data-source-card-header-title">
            {{ item.name }}
          </div>
          <div class="data-source-card-header-action">
            <var-button text type="primary" @click="delDataSource">删除</var-button>
          </div>
        </div>

        <var-divider />

        <div class="data-source-card-description">
          {{ item.description }}
        </div>
      </div>
    </div>
  </div>

  <data-source-modal
    :form-data="formData"
    :modal-show="modalShow"
    @close="modalShow = false"
    @confirm="updateDataSource"
  ></data-source-modal>
</template>

<style lang="less">
.varlet-low-code-code-data-source {
  width: 400px;
  background-color: #fff;
  padding: 10px;
  .data-source-header {
    display: flex;
    justify-content: flex-end;
  }
  .data-source-card {
    border: 1px solid rgba(31, 56, 88, 0.1);
    border-radius: 6px;
    padding: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    position: relative;
    &-chip {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-weight: normal;
      font-size: 40px;
      color: #3a7afe20;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      &-word {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      &-title {
        color: #555;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    &-description {
      height: 40px;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: rgba(31, 56, 88, 0.7);
    }
  }
}
.var-dialog {
  --dialog-width: 40vw;
}
</style>
