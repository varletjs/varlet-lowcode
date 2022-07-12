<script setup lang="ts">
import Popover from '../popover/popover'
import { Icon } from '@varlet/ui'
import { defineProps, defineEmits, computed } from 'vue'
import './index.less'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'BoolSetter',
  },
})
const emit = defineEmits(['update:modelValue', 'SelectVariable'])
const bindType = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
  },
})

const changeBindType = (val: string) => {
  bindType.value = val
  emit('update:modelValue', val)
  if (val === 'variableInput') {
    emit('SelectVariable')
  }
}
</script>

<template>
  <div class="main">
    <Popover>
      <template #default>
        <div>
          <Icon name="dots-vertical" />
        </div>
      </template>
      <template #content>
        <div class="varlet-low-code__popover--select-bind">
          <div @click="changeBindType('BoolSetter')" class="varlet-low-code__select--item">
            <Icon name="check" :class="bindType !== 'BoolSetter' ? 'varlet-low-code__opacity' : ''" color="#2979ff" />
            BoolSetter
          </div>
          <div @click="changeBindType('variableInput')" class="varlet-low-code__select--item">
            <Icon
              name="check"
              :class="bindType !== 'variableInput' ? 'varlet-low-code__opacity' : ''"
              color="#2979ff"
            />
            变量输入
          </div>
        </div>
      </template>
    </Popover>
  </div>
</template>
