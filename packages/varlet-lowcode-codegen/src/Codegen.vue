<script setup lang="ts">
import { Button as VarButton } from '@varlet/ui'
import { schemaManager, eventsManager, assetsManager, BuiltInEvents, AssetProfileMaterial } from '@varlet/lowcode-core'
import '@varlet/ui/es/button/style/index.js'
import { isArray, isPlainObject, isString, kebabCase } from './shared'
import type { SchemaNode, SchemaPageNode, Assets, SchemaNodeSlot } from '@varlet/lowcode-core'

let schema: SchemaPageNode = schemaManager.exportSchema()
let assets: Assets = assetsManager.exportAssets()

eventsManager.on(BuiltInEvents.SCHEMA_CHANGE, (newSchema) => {
  schema = newSchema
})

eventsManager.on(BuiltInEvents.ASSETS_CHANGE, (newAssets) => {
  assets = newAssets
})

const stringifyObject = (object: any[] | Record<string, any>): string => {
  return JSON.stringify(object).replace(/"(.+)":/g, '$1:')
}

const convertVariable = (value: string) => {
  return value
    .replace(/\$index\[['"](.+)['"]\]/g, '$index_$1')
    .replace(/\$index\.(.+)(?![.\[])/g, '$index_$1')
    .replace(/\$item\[['"](.+)['"]\]/g, '$item_$1')
    .replace(/\$item\.(.+)(?![.\[])/g, '$item_$1')
    .replace(/\$slotProps\[['"](.+)['"]\]/g, '$slotProps_$1')
    .replace(/\$slotProps\.(.+)(?![.\[])/g, '$slotProps_$1')
    .replace(/\.value/g, '')
    .replace(/\[['"]value['"]\]/g, '')
}

const convertEventName = (key: string) => {
  if (!key.startsWith('on')) {
    return `:${kebabCase(key)}`
  }

  const eventName = kebabCase(key.slice(2))

  return `@${eventName.at(0)!.toLowerCase()}${eventName.slice(1)}`
}

const genProps = (schemaNode: SchemaNode): string => {
  return Object.entries(schemaNode.props ?? {}).reduce((propsString, [key, value]) => {
    if (schemaManager.isExpressionBinding(value)) {
      propsString += ` ${convertEventName(key)}="${convertVariable(value.value)}"\n`

      return propsString
    }

    if (schemaManager.isObjectBinding(value)) {
      propsString += ` :${key}="${stringifyObject(value.value)}"\n`

      return propsString
    }

    if (isArray(value)) {
      propsString += ` :${key}="${stringifyObject(value)}"\n`

      return propsString
    }

    if (isString(value)) {
      propsString += ` ${key}="${value}"\n`

      return propsString
    }

    propsString += ` :${key}="${value}"\n`

    return propsString
  }, '')
}

const genCondition = (schemaNode: SchemaNode): string => {
  if (!Object.hasOwn(schemaNode, 'if')) {
    return ''
  }

  if (schemaManager.isExpressionBinding(schemaNode.if)) {
    return `v-if="${convertVariable(schemaNode.if.value)}"`
  }

  if (schemaManager.isObjectBinding(schemaNode.if)) {
    return `v-if="${stringifyObject(schemaNode.if.value)}"`
  }

  if (isArray(schemaNode.if)) {
    return `v-if="${stringifyObject(schemaNode.if)}"`
  }

  if (isString(schemaNode.if)) {
    return `v-if="'${schemaNode.if}'"`
  }

  return `v-if="${schemaNode.if}"`
}

const genLoop = (schemaNode: SchemaNode): string => {
  if (!Object.hasOwn(schemaNode, 'for')) {
    return ''
  }

  if (schemaManager.isExpressionBinding(schemaNode.for)) {
    return `v-for="$item_${schemaNode.id} in ${convertVariable(schemaNode.for.value)}"`
  }

  if (schemaManager.isObjectBinding(schemaNode.for)) {
    return `v-for="$item_${schemaNode.id} in ${stringifyObject(schemaNode.for.value)}"`
  }

  if (isArray(schemaNode.for)) {
    return `v-for="$item_${schemaNode.id} in ${stringifyObject(schemaNode.for)}"`
  }

  if (isString(schemaNode.for)) {
    return `v-for="$item_${schemaNode.id} in '${schemaNode.for}'"`
  }

  return `v-for="$item_${schemaNode.id} in ${schemaNode.for}"`
}

const genSlots = (
  schemaNodeSlots: Record<string, SchemaNodeSlot>,
  schemaNode: SchemaNode,
  material: AssetProfileMaterial
) => {
  return Object.entries(schemaNodeSlots)
    .map(([slotName, slot]) => {
      const hasSlotProps = material.slots?.find((slot) => slot.name === slotName)?.hasSlotProps ?? false
      const slotPropsVariable = hasSlotProps ? `="$slotProps_${schemaNode.id}"` : ''

      if (slotName === 'default' && !hasSlotProps) {
        return slot.children.map(genSchemaNode).join('\n')
      }

      return `\
<template #${slotName}${slotPropsVariable}>
  ${slot.children.map(genSchemaNode).join('\n')}
</template>
`
    })
    .join('\n')
}

const genSchemaNode = (schemaNode: SchemaNode): string => {
  if (schemaManager.isSchemaPageNode(schemaNode) && isArray(schemaNode.slots?.default.children)) {
    return schemaNode.slots!.default.children.map(genSchemaNode).join('\n')
  }

  if (schemaManager.isSchemaPageNode(schemaNode) && !isArray(schemaNode.slots?.default.children)) {
    return ''
  }

  if (schemaManager.isSchemaTextNode(schemaNode)) {
    if (schemaManager.isExpressionBinding(schemaNode.textContent)) {
      return `{{ ${convertVariable(schemaNode.textContent.value)} }}`
    }
    return schemaNode.textContent
  }

  const material = assetsManager.findMaterial(assets, schemaNode.name)
  const { name } = material.codegen

  if (!isPlainObject(schemaNode.slots)) {
    return `  <${name}${genProps(schemaNode)}${genCondition(schemaNode)}${genLoop(schemaNode)} />`
  }

  return `  <${name}${genProps(schemaNode)}${genCondition(schemaNode)}${genLoop(schemaNode)}>${genSlots(
    schemaNode.slots,
    schemaNode,
    material
  )}</${name}>`
}

const codegen = () => {
  console.log(`\
<template>
  <div class="varlet-low-code-page">
    ${genSchemaNode(schema)}
  </div>
</template>
`)
}
</script>

<template>
  <div class="varlet-low-code-codegen">
    <var-button type="primary" @click="codegen">Codegen</var-button>
  </div>
</template>
