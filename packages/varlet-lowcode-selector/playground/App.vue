<script setup lang="ts">
import Selector from '../src/Selector'
import Button from './Button.vue';
import { eventsManager } from '@varlet/lowcode-core'

const onClick = (e: Event) => {
  eventsManager.emit('schema-click', e)
}

</script>

<template>
  <Selector />
  <div class="button-groups">
    <Button @click="onClick" />
    <Button @click="onClick">12312313</Button>
    <Button @click="onClick">34534534</Button>
    <Button @click="onClick">565687878</Button>
    <Button @click="onClick">80980989098</Button>
    <Button @click="onClick">qwerqwer</Button>
    <Button @click="onClick">asdfasdfsdf</Button>
  </div>
</template>
<style scoped>
.button-groups{
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>