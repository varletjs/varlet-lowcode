<script setup lang="ts">
import Drag from '../src/Drag'
import Drop from '../src/Drop'
</script>

<template>
  <div>
    <Drag>
      <div>Drag me</div>
    </Drag>
    <Drop class="drop-place"> </Drop>
  </div>
</template>

<style>
.drop-place {
  height: 500px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 20px;
  margin: 20px;
}
</style>
