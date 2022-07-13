<script setup lang="ts">
import Designer from '../src/Designer.vue'
import Codegen from '@varlet/lowcode-codegen'
import CodeEditor from '@varlet/lowcode-code-editor'
import SchemaEditor from '@varlet/lowcode-schema-editor'
</script>

<template>
  <designer />
  <code-editor />
  <schema-editor />
  <codegen />
</template>
