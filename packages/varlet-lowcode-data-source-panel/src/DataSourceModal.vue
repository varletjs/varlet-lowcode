<!--<script setup lang="ts">-->
<!--import { ref, watch, PropType, defineEmits, defineProps } from 'vue'-->
<!--// import Monaco from '@varlet/lowcode-monaco'-->
<!--import {-->
<!--  Dialog,-->
<!--  // Button as VarButton,-->
<!--  Form as VarForm,-->
<!--  // Icon as VarIcon,-->
<!--  Input as VarInput,-->
<!--  // Option as VarOption,-->
<!--  // Select as VarSelect,-->
<!--  // Snackbar as VarSnackbar-->
<!--} from '@varlet/ui'-->
<!--import '@varlet/ui/es/button/style/index.js'-->
<!--import '@varlet/ui/es/row/style/index.js'-->
<!--import '@varlet/ui/es/col/style/index.js'-->

<!--import type { SchemaPageNodeDataSource } from '@varlet/lowcode-core'-->
<!--// import type { SchemaPageNodeDataSource, BuiltInEvents, eventsManager, schemaManager } from '@varlet/lowcode-core'-->
<!--import type { Ref } from 'vue'-->
<!--// import type { IRange } from 'monaco-editor'-->

<!--const props = defineProps({-->
<!--  modelValue: { type: Boolean, required: true },-->
<!--  modalShow: { type: Boolean, default: false, },-->
<!--  formData: { type: Object as PropType<SchemaPageNodeDataSource>, required: true, },-->
<!--})-->

<!--const VarDialog = Dialog.Component-->

<!--// const listMethod = ref(['get', 'getBlob', 'getDocument', 'getText', 'getArrayBuffer', 'getStream', 'head', 'headBlob', 'headDocument', 'headText', 'headArrayBuffer', 'headStream', 'options', 'optionsBlob', 'optionsDocument', 'optionsText', 'optionsArrayBuffer', 'optionsStream', 'delete', 'deleteBlob', 'deleteDocument', 'deleteText', 'deleteArrayBuffer', 'deleteStream', 'post', 'postJSON', 'postMultipart', 'put', 'putJSON', 'putMultipart', 'patch', 'patchJSON', 'patchMultipart'])-->

<!--const dataSourceForm = ref(JSON.parse(JSON.stringify(props.formData)))-->
<!--const show: Ref<boolean | undefined> = ref(false)-->
<!--const headersMockList: Ref<any[]> = ref([])-->

<!--const NOOP_SUCCESS = 'function successHandler() {\n  return {\n}\n}'-->
<!--const NOOP_ERROR = 'function errorHandler() {\n  return {\n}\n}'-->

<!--const successHandler: Ref<string> = ref(dataSourceForm.value.successHandler || NOOP_SUCCESS)-->
<!--const errorHandler: Ref<string> = ref(dataSourceForm.value.errorHandler || NOOP_ERROR)-->

<!--watch(-->
<!--  () => props.modalShow,-->
<!--  (value) => {-->
<!--    show.value = value-->
<!--  }-->
<!--)-->

<!--watch(-->
<!--  () => props.formData,-->
<!--  () => {-->
<!--    dataSourceForm.value = JSON.parse(JSON.stringify(props.formData))-->
<!--    updateHeadersMockList()-->
<!--    updateCallback()-->
<!--  }-->
<!--)-->

<!--// let isShowModal = ref(props.modelValue)-->

<!--const updateCallback = (): void => {-->
<!--  successHandler.value = dataSourceForm.value.successHandler ?? NOOP_SUCCESS-->
<!--  errorHandler.value = dataSourceForm.value.errorHandler ?? NOOP_ERROR-->
<!--}-->

<!--const updateHeadersMockList = (): void => {-->
<!--  headersMockList.value = []-->
<!--  const { headers } = dataSourceForm.value-->
<!--  for (const key in headers) {-->
<!--    if (headers.hasOwnProperty(key)) {-->
<!--      const item = {-->
<!--        key,-->
<!--        value: headers[key],-->
<!--      }-->
<!--      headersMockList.value.push(item)-->
<!--    }-->
<!--  }-->
<!--}-->

<!--// const syncHeadersMockList = (): void => {-->
<!--//   headersMockList.value.forEach((item) => {-->
<!--//     dataSourceForm.value.headers[item.key] = item.value-->
<!--//   })-->
<!--// }-->

<!--// const syncCallback = (): void => {-->
<!--//   dataSourceForm.value.successHandler = successHandler.value-->
<!--//   dataSourceForm.value.errorHandler = errorHandler.value-->
<!--// }-->

<!--const emits = defineEmits(['close', 'confirm'])-->

<!--// const handleModalClose = (): void => {-->
<!--//   // emits('close')-->
<!--//   defineEmits(['close', 'update:modelValue'])-->
<!--// }-->

<!--// const handleModalConfirm = (): void => {-->
<!--//   syncHeadersMockList()-->
<!--//   syncCallback()-->
<!--//   emits('confirm', dataSourceForm.value)-->
<!--// }-->

<!--const change = (value: string) => {-->
<!--  console.log(value)-->
<!--  console.log(dataSourceForm.value.method)-->
<!--}-->

<!--// const handleAddHeaders = () => {-->
<!--//   if(headersMockList.value.length > 99) {-->
<!--//     VarSnackbar.error('添加请求头数量上限');-->
<!--//     return;-->
<!--//   }-->
<!--//-->
<!--//   headersMockList.value.push({ key: '', value: '' });-->
<!--// }-->

<!--// const handleDeleteHeaders = (index: number) => {-->
<!--//   headersMockList.value.splice(index, 1)-->
<!--// }-->

<!--// function createApiSuggestions(range: IRange) {-->
<!--//   return [-->
<!--//     'h',-->
<!--//     'renderList',-->
<!--//     'ref',-->
<!--//     'reactive',-->
<!--//     'computed',-->
<!--//     'readonly',-->
<!--//     'watch',-->
<!--//     'watchEffect',-->
<!--//     'watchSyncEffect',-->
<!--//     'watchPostEffect',-->
<!--//     'isRef',-->
<!--//     'unref',-->
<!--//     'toRefs',-->
<!--//     'isProxy',-->
<!--//     'isReactive',-->
<!--//     'isReadonly',-->
<!--//     'onBeforeMount',-->
<!--//     'onMounted',-->
<!--//     'onBeforeUpdate',-->
<!--//     'onUpdated',-->
<!--//     'onBeforeUnmount',-->
<!--//     'onUnmounted',-->
<!--//     'useDataSources',-->
<!--//   ].map((name) => {-->
<!--//     return {-->
<!--//       label: name,-->
<!--//       kind: 17,-->
<!--//       documentation: `https://github.com/varletjs/varlet-lowcode`,-->
<!--//       insertText: `${name}()`,-->
<!--//       range,-->
<!--//       detail: `vue: ${name}`,-->
<!--//     }-->
<!--//   })-->
<!--// }-->

<!--updateHeadersMockList()-->
<!--</script>-->

<!--<template>-->
<!--  <var-dialog class='data-source-modal' v-model:show="show">-->
<!--    <template #title>数据源</template>-->
<!--    <var-form class='data-source-modal-form' ref='dataSourceFormRef'>-->
<!--      <div class='data-source-modal-form-item'>-->
<!--        <p class='data-source-modal-form-item-label'>数据源名称:</p>-->
<!--        <var-input v-model='dataSourceForm.name'></var-input>-->
<!--      </div>-->
<!--      <div class='data-source-modal-form-item'>-->
<!--        <p class='data-source-modal-form-item-label'>数据源名称:</p>-->
<!--        <var-input v-model='dataSourceForm.name'></var-input>-->
<!--      </div>-->
<!--    </var-form>-->
<!--  </var-dialog>-->
<!--  -->
<!--&lt;!&ndash;  <var-dialog style='max-height: 90vh; overflow-y: auto' v-model:show="show" @close="handleModalClose" @confirm="handleModalConfirm">&ndash;&gt;-->
<!--&lt;!&ndash;    <template #title>数据源</template>&ndash;&gt;-->

<!--&lt;!&ndash;    <var-form ref="form" class="data-source-modal-form">&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="data-source-modal-form-item">&ndash;&gt;-->
<!--&lt;!&ndash;        <p class="data-source-modal-form-item-label">数据源名称:</p>&ndash;&gt;-->
<!--&lt;!&ndash;        <var-input v-model="dataSourceForm.name" :hint="false" :rules="[(v: string) => !!v || '名称不能为空']" placeholder="请输入名称" />&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="data-source-modal-form-item">&ndash;&gt;-->
<!--&lt;!&ndash;        <p class="data-source-modal-form-item-label">请求地址:</p>&ndash;&gt;-->
<!--&lt;!&ndash;        <var-input v-model="dataSourceForm.url" :hint="false" :rules="[(v: string) => !!v || '请求地址不能为空']" placeholder="请输入请求地址" />&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="data-source-modal-form-item">&ndash;&gt;-->
<!--&lt;!&ndash;        <p class="data-source-modal-form-item-label">请求方法:</p>&ndash;&gt;-->
<!--&lt;!&ndash;        <var-select v-model="dataSourceForm.method" :hint="false" @change="change" placeholder="请选择请求方法">&ndash;&gt;-->
<!--&lt;!&ndash;          <var-option v-for="item in listMethod" :key='item' :label='item'></var-option>&ndash;&gt;-->
<!--&lt;!&ndash;        </var-select>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="data-source-modal-form-item">&ndash;&gt;-->
<!--&lt;!&ndash;        <p class="data-source-modal-form-item-label">是否支持跨域:</p>&ndash;&gt;-->
<!--&lt;!&ndash;        <var-select v-model="dataSourceForm.withCredentials" :hint="false" placeholder="请选择是否支持跨域">&ndash;&gt;-->
<!--&lt;!&ndash;          <var-option label="是" :value="true" />&ndash;&gt;-->
<!--&lt;!&ndash;          <var-option label="否" :value="false" />&ndash;&gt;-->
<!--&lt;!&ndash;        </var-select>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="data-source-modal-form-item">&ndash;&gt;-->
<!--&lt;!&ndash;        <p class="data-source-modal-form-item-label">超时时长(毫秒):</p>&ndash;&gt;-->
<!--&lt;!&ndash;        <var-input v-model="dataSourceForm.timeout" :hint="false" placeholder="请输入超时时长" />&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="data-source-modal-form-item row">&ndash;&gt;-->
<!--&lt;!&ndash;        <p class="data-source-modal-form-item-label">请求头信息:</p>&ndash;&gt;-->
<!--&lt;!&ndash;        <div v-if='headersMockList.length' style='width: 100%; max-height: 20vh; margin-bottom: 10px; overflow-y: auto'>&ndash;&gt;-->
<!--&lt;!&ndash;          <table style='width: 100%;'>&ndash;&gt;-->
<!--&lt;!&ndash;            <tr><th>Key</th><th>Value</th><th></th></tr>&ndash;&gt;-->
<!--&lt;!&ndash;            <tr style='margin-bottom: 10px;' v-for="(item, index) in headersMockList" :key="index">&ndash;&gt;-->
<!--&lt;!&ndash;              <td><var-input style='width: 95%;' v-model="item.key" :hint="false" :rules="[(v: string) => !!v || 'key不能为空']" placeholder="请输入key" /></td>&ndash;&gt;-->
<!--&lt;!&ndash;              <td><var-input style='width: 95%;' v-model="item.value" :hint="false" placeholder="请输入value" /></td>&ndash;&gt;-->
<!--&lt;!&ndash;              <td style='display: flex; justify-content: center;'><var-button type="danger" size="mini" round @click="handleDeleteHeaders(index)"><var-icon name="trash-can-outline" /></var-button></td>&ndash;&gt;-->
<!--&lt;!&ndash;            </tr>&ndash;&gt;-->
<!--&lt;!&ndash;          </table>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="headers-button">&ndash;&gt;-->
<!--&lt;!&ndash;          <var-button type="primary" size="mini" round @click="handleAddHeaders"><var-icon name="plus" /></var-button>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="data-source-modal-form-item row">&ndash;&gt;-->
<!--&lt;!&ndash;        <p class="data-source-modal-form-item-label">成功回调:</p>&ndash;&gt;-->
<!--&lt;!&ndash;        <monaco :create-suggestions="createApiSuggestions" height="100px" width="100%" v-model:code="successHandler" />&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;    </var-form>&ndash;&gt;-->
<!--&lt;!&ndash;  </var-dialog>&ndash;&gt;-->
<!--</template>-->

<!--<style lang="less" scoped>-->
<!--@media screen and (max-width: 1200px) {-->
<!--  .data-source-modal-form > .data-source-modal-form-item {-->
<!--    width: 100%;-->
<!--  }-->
<!--}-->

<!--.data-source-modal {-->
<!--  width: 30vw;-->
<!--  height: 50vh;-->
<!--  -->
<!--  &-form {-->
<!--    display: flex;-->
<!--    flex-wrap: wrap;-->
<!--    justify-content: space-between;-->
<!--    -->
<!--    &-item {-->
<!--      width: 50%;-->
<!--      -->
<!--      &-label {-->
<!--        color: #525f7f;-->
<!--        font-size: 13px;-->
<!--        font-weight: 500;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.data-source-modal-form {-->
<!--  display: flex;-->
<!--  flex-wrap: wrap;-->
<!--  justify-content: space-between;-->
<!--  -->
<!--  &-item {-->
<!--    width: 50%;-->
<!--    min-width: 220px;-->
<!--    padding: 10px 20px;-->
<!--  -->
<!--    display: flex;-->
<!--    flex-direction: column;-->
<!--    -->
<!--    &-label {-->
<!--      color: #525f7f;-->
<!--      font-size: 13px;-->
<!--      font-weight: 500;-->
<!--    }-->

<!--    .headers-button {-->
<!--      display: flex;-->
<!--      justify-content: center;-->
<!--    }-->
<!--  }-->
<!--  -->
<!--  .row {-->
<!--    width: 100%;-->
<!--  }-->
<!--}-->
<!--</style>-->
