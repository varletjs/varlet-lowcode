<script setup lang="ts">
import index from './template/index.html?raw'
import pkg from './template/package.json?raw'
import config from './template/vite.config.js?raw'
import readme from './template/README.md?raw'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import * as t from '@babel/types'
import '@varlet/ui/es/button/style/index.js'
import { Button as VarButton } from '@varlet/ui'
import { assetsManager, BuiltInEvents, eventsManager, schemaManager } from '@varlet/lowcode-core'
import { saveAs } from 'file-saver'
import { parse } from '@babel/parser'
import { isArray, isPlainObject, isString, kebabCase } from './shared'
import type { AssetProfileMaterial, Assets, SchemaNode, SchemaNodeSlot, SchemaPageNode } from '@varlet/lowcode-core'

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

const convertExpressionValue = (value: string) => {
  value = value
    .replace(/\$index\[['"](.+)['"]\]/g, '$index_$1')
    .replace(/\$index\.(.+)(?![.\[])/g, '$index_$1')
    .replace(/\$item\[['"](.+)['"]\]/g, '$item_$1')
    .replace(/\$item\.(.+)(?![.\[])/g, '$item_$1')
    .replace(/\$slotProps\[['"](.+)['"]\]/g, '$slotProps_$1')
    .replace(/\$slotProps\.(.+)(?![.\[])/g, '$slotProps_$1')

  const ast = parse(value, {
    sourceType: 'module',
  })

  traverse(ast, {
    MemberExpression(path) {
      if (
        path.node.object.type === 'Identifier' &&
        path.node.property.type === 'Identifier' &&
        path.node.property.name === 'value'
      ) {
        path.replaceWith(t.identifier(path.node.object.name))
      }
    },
  })

  const { code } = generate(ast)

  return code.endsWith(';') ? code.slice(0, -1) : code
}

const convertEventName = (key: string) => {
  if (!key.startsWith('on')) {
    return `:${kebabCase(key)}`
  }

  const eventName = kebabCase(key.slice(2))

  return `@${eventName.at(0)!.toLowerCase()}${eventName.slice(1)}`
}

const genPackages = () => {
  const packages: Record<string, [string, string]> = {}

  schemaManager.visitSchemaNode(schema, (schemaNode) => {
    if (schemaManager.isSchemaPageNode(schemaNode) || schemaManager.isSchemaTextNode(schemaNode)) {
      return
    }

    const { packageName, packageVersion } = assetsManager.findProfile(assets, schemaNode.name, schemaNode.library!)

    packages[schemaNode.library!] = [packageName, packageVersion]
  })

  return packages
}

const genProps = (schemaNode: SchemaNode): string => {
  return Object.entries(schemaNode.props ?? {}).reduce((propsString, [key, value]) => {
    if (schemaManager.isExpressionBinding(value)) {
      propsString += ` ${convertEventName(key)}="${convertExpressionValue(value.value)}"`

      return propsString
    }

    if (schemaManager.isObjectBinding(value)) {
      propsString += ` :${key}="${stringifyObject(value.value)}"`

      return propsString
    }

    if (isArray(value)) {
      propsString += ` :${key}="${stringifyObject(value)}"`

      return propsString
    }

    if (isString(value)) {
      propsString += ` ${key}="${value}"`

      return propsString
    }

    propsString += ` :${key}="${value}"`

    return propsString
  }, '')
}

const genCondition = (schemaNode: SchemaNode): string => {
  if (!Object.hasOwn(schemaNode, 'if')) {
    return ''
  }

  if (schemaManager.isExpressionBinding(schemaNode.if)) {
    return ` v-if="${convertExpressionValue(schemaNode.if.value)}"`
  }

  if (schemaManager.isObjectBinding(schemaNode.if)) {
    return ` v-if="${stringifyObject(schemaNode.if.value)}"`
  }

  if (isArray(schemaNode.if)) {
    return ` v-if="${stringifyObject(schemaNode.if)}"`
  }

  if (isString(schemaNode.if)) {
    return ` v-if="'${schemaNode.if}'"`
  }

  return ` v-if="${schemaNode.if}"`
}

const genLoop = (schemaNode: SchemaNode): string => {
  if (!Object.hasOwn(schemaNode, 'for')) {
    return ''
  }

  if (schemaManager.isExpressionBinding(schemaNode.for)) {
    return ` v-for="$item_${schemaNode.id} in ${convertExpressionValue(schemaNode.for.value)}"`
  }

  if (schemaManager.isObjectBinding(schemaNode.for)) {
    return ` v-for="$item_${schemaNode.id} in ${stringifyObject(schemaNode.for.value)}"`
  }

  if (isArray(schemaNode.for)) {
    return ` v-for="$item_${schemaNode.id} in ${stringifyObject(schemaNode.for)}"`
  }

  if (isString(schemaNode.for)) {
    return ` v-for="$item_${schemaNode.id} in '${schemaNode.for}'"`
  }

  return ` v-for="$item_${schemaNode.id} in ${schemaNode.for}"`
}

const genSlots = (
  schemaNodeSlots: Record<string, SchemaNodeSlot>,
  schemaNode: SchemaNode,
  material: AssetProfileMaterial,
  depth: number
) => {
  return Object.entries(schemaNodeSlots)
    .map(([slotName, slot]) => {
      const hasSlotProps = material.slots?.find((slot) => slot.name === slotName)?.hasSlotProps ?? false
      const slotPropsVariable = hasSlotProps ? `="$slotProps_${schemaNode.id}"` : ''

      if (slotName === 'default' && !hasSlotProps) {
        return slot.children.map((schemaNode) => genSchemaNode(schemaNode, depth + 1)).join('\n')
      }

      const indent = ' '.repeat((depth + 1) * 2)

      return `\
${indent}<template #${slotName}${slotPropsVariable}>
${slot.children.map((schemaNode) => genSchemaNode(schemaNode, depth + 2)).join('\n')}
${indent}</template>`
    })
    .join('\n')
}

const genSchemaNode = (schemaNode: SchemaNode, depth = 1): string => {
  const indent = ' '.repeat(depth * 2)

  if (schemaManager.isSchemaPageNode(schemaNode) && isArray(schemaNode.slots?.default.children)) {
    return schemaNode.slots!.default.children.map((schemaNode) => genSchemaNode(schemaNode, depth + 1)).join('\n')
  }

  if (schemaManager.isSchemaPageNode(schemaNode) && !isArray(schemaNode.slots?.default.children)) {
    return ''
  }

  if (schemaManager.isSchemaTextNode(schemaNode)) {
    if (schemaManager.isExpressionBinding(schemaNode.textContent)) {
      return `${indent}{{ ${convertExpressionValue(schemaNode.textContent.value)} }}`
    }
    return `${indent}${schemaNode.textContent}`
  }

  const material = assetsManager.findMaterial(assets, schemaNode.name, schemaNode.library!)
  const { name } = material.codegen

  if (!isPlainObject(schemaNode.slots)) {
    return `${indent}<${name}${genProps(schemaNode)}${genCondition(schemaNode)}${genLoop(schemaNode)} />`
  }

  return `${indent}<${name}${genProps(schemaNode)}${genCondition(schemaNode)}${genLoop(schemaNode)}>\n${genSlots(
    schemaNode.slots,
    schemaNode,
    material,
    depth
  )}\n${indent}</${name}>`
}

const genApp = (packages: Record<string, [string, string]>) => {
  return `\
<template>
  <div class="varlet-low-code-page">
${genSchemaNode(schema)}
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'vue'
${genPackageImports(packages)}

${schema.code}

export default defineComponent({
  setup
})
<${'/'}script>
`
}

const genPackageImports = (packages: Record<string, [string, string]>) => {
  return Object.entries(packages).map(([library, [packageName]]) => {
    return `\
import ${library} from '${packageName}'
`
  })
}

const genMain = (packages: Record<string, [string, string]>) => {
  const packageUses = Object.entries(packages).map(([library]) => {
    return `\
.use(${library})`
  })

  return `\
import App from './App.vue'
${genPackageImports(packages)}
import { createApp } from 'vue'

const app = createApp(App)

app${packageUses.join('')}
app.mount('#app')
`
}

const genPkg = (packages: Record<string, [string, string]>) => {
  const packagesString = Object.entries(packages).map(([_, [packageName, packageVersion]]) => {
    return `    "${packageName}": "${packageVersion}"`
  })
  return pkg.replace(
    '"vite": "latest"',
    `\
"vite": "latest",
${packagesString.join(',\n')}\
`
  )
}

const genIndex = () => {
  const resources = assetsManager.getResources(assets)
  const scripts = resources.map((resource) => `    <script src="${resource}"><${'/'}script>`)

  return index.replace(
    `    <script type="module" src="/src/main.js"><${'/'}script>`,
    `\
${scripts.join('\n')}
    <script type="module" src="/src/main.js"><${'/'}script>\
`
  )
}

const genConfig = (packages: Record<string, [string, string]>) => {
  const externals = Object.entries(packages).map(([library, [packageName]]) => {
    return `      '${packageName}': '${library}'`
  })

  return config.replace(
    '    viteExternalsPlugin()',
    `\
    viteExternalsPlugin({
      vue: 'Vue',
${externals.join(',\n')}
    })`
  )
}

const save = async () => {
  const packages = genPackages()
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()

  zip.file('index.html', genIndex())
  zip.file('package.json', genPkg(packages))
  zip.file('vite.config.js', genConfig(packages))
  zip.file('README.md', readme)

  const src = zip.folder('src')!

  src.file('App.vue', genApp(packages))
  src.file('main.js', genMain(packages))

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, 'vite-varlet-low-code-starter.zip')
}
</script>

<template>
  <div class="varlet-low-code-codegen">
    <var-button type="primary" @click="save">Codegen</var-button>
  </div>
</template>
