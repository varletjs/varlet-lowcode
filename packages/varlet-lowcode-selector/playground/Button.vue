<template>
  <button class="primary-button">
    <slot>
      Primary Button
    </slot>
  </button>
</template>

<style scoped>
.primary-button{
  background-color: #0070f3;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 3px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}
</style>