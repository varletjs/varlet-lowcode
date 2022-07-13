<script setup lang="ts">
import { ref, PropType, defineEmits, defineProps } from 'vue'
import {
  Dialog,
  // Button as VarButton,
  Form as VarForm,
  Input as VarInput,
  Select as VarSelect,
  Option as VarOption,
} from '@varlet/ui'

import type { SchemaPageNodeDataSource } from '@varlet/lowcode-core'

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

const show = ref(JSON.parse(JSON.stringify(props.modalShow)))

const emits = defineEmits(['close'])

const handleModalClose = (): void => {
  emits('close')
}

const change = (value: string) => {
  console.log(value)
  console.log(dataSourceForm.value.method)
}
</script>

<template>
  <!-- <div class="data-source-modal"> -->
  <var-dialog v-model:show="show" @close="handleModalClose">
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
          <var-select placeholder="请选择请求方法" v-model="dataSourceForm.method" @change="change">
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
          <var-select placeholder="请选择是否支持跨域" v-model="dataSourceForm.withCredentials">
            <var-option label="是" :value="true" />
            <var-option label="否" :value="false" />
          </var-select>
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
    // display: flex;
    // justify-content: center;
    // align-items: center;
    gap: 20px;
    width: calc(50% - 7.5px);
    &-label {
      color: #222;
    }
  }
}
</style>
