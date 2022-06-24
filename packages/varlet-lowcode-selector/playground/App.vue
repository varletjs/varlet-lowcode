<script setup lang="ts">
import Selector from '../src/Selector'
import Button from './Button.vue';
import { eventsManager } from '@varlet/lowcode-core'

const onClick = (e: Event) => {
  console.log("123123", e);
  
  eventsManager.emit('schema-click', e?.target?.id || '')
}

</script>

<template>
  <Selector />
  <div class="button-groups">
    <Button id="asd" @click="onClick" />
    <Button id="asd" @click="onClick">12312313</Button>
    <Button id="asd" @click="onClick">34534534</Button>
    <Button id="asd" @click="onClick">565687878</Button>
    <Button id="asd" @click="onClick">80980989098</Button>
    <Button id="asd" @click="onClick">qwerqwer</Button>
    <Button id="asd" @click="onClick">asdfasdfsdf</Button>
  </div>
</template>
<style scoped>
.button-groups{
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>