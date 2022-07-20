<script setup lang="ts">
import Selector from '../src'
import Button from './Button.vue'
import { eventsManager } from '@varlet/lowcode-core'

const onClick = (e: Event) => {
  eventsManager.emit('selector', (<HTMLElement>e?.target).id || '')
}
</script>

<template>
  <Selector :designer-events-manager="eventsManager" />
  <div class="button-groups">
    <Button id="dragItemasd1" @click="onClick" />
    <Button id="dragItemasd2" @click="onClick">12312313</Button>
    <Button id="dragItemasd3" @click="onClick">34534534</Button>
    <Button id="dragItemasd4" @click="onClick">565687878</Button>
    <Button id="dragItemasd5" @click="onClick">80980989098</Button>
    <Button id="dragItemasd6" @click="onClick">qwerqwer</Button>
    <Button id="dragItemasd7" @click="onClick">asdfasdfsdf</Button>
  </div>
</template>
<style scoped>
.button-groups {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
