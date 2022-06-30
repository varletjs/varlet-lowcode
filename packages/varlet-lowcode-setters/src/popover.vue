<template>
  <Popper arrow>
    <div class="current-color"></div>
    <template #content>
      <div>213564</div>
      <ColorPicker v-model:pureColor="pureColor" is-widget />
    </template>
  </Popper>
</template>

<script>
import { defineComponent, ref } from 'vue'
import Popper from 'vue3-popper'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'

export default defineComponent({
  name: 'MyPopperWrapper',
  components: {
    Popper,
    ColorPicker,
  },
  setup() {
    const pureColor = ref('red')
  },
})
</script>
