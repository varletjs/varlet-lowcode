<script setup lang="ts">
import Popover from '../popover/popover'
import { Icon } from '@varlet/ui'
import './index.less'
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
          <div><Icon name="check" />BoolSetter</div>
          <div><Icon name="check" />变量输入</div>
        </div>
      </template>
    </Popover>
  </div>
</template>
