<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { Button as VarButton, Input as VarInput } from '@varlet/ui'
import '@varlet/ui/es/button/style/index'
import '@varlet/ui/es/input/style/index'

const size: Ref<string> = ref('100%')

watch(
  () => size.value,
  (newValue) => {
    resize(newValue)
  }
)

function resize(size: string) {
  const designer = document.querySelector('.varlet-low-code-designer') as HTMLElement

  if (!designer) {
    return
  }

  designer.style.width = size
}
</script>

<template>
  <div class="varlet-low-code-resizer">
    <var-button size="small" text @click="size = '100%'">
      <svg
        class="varlet-low-code-resizer__svg"
        style="width: 20px"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z"
        />
      </svg>
    </var-button>

    <var-button size="small" text @click="size = '768px'">
      <svg class="varlet-low-code-resizer__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M19,18H5V6H19M21,4H3C1.89,4 1,4.89 1,6V18A2,2 0 0,0 3,20H21A2,2 0 0,0 23,18V6C23,4.89 22.1,4 21,4Z" />
      </svg>
    </var-button>

    <var-button size="small" text @click="size = '375px'">
      <svg class="varlet-low-code-resizer__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z" />
      </svg>
    </var-button>

    <var-input class="varlet-low-code-resizer__input" :hint="false" v-model="size" />
  </div>
</template>

<style lang="less">
.varlet-low-code-resizer {
  display: flex;
  align-items: center;

  &__svg {
    width: 20px;

    path {
      fill: #666;
    }
  }

  &__input {
    width: 48px !important;
    margin-left: 8px;
    transform: translateY(-1px);

    .var-input__input {
      text-align: center;
    }
  }
}
</style>
