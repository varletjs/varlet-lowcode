<script setup lang="ts">
import index from './template/index.html?raw'
import pkg from './template/package.json?raw'
import config from './template/vite.config.js?raw'
import readme from './template/README.md?raw'
import JSZip from 'jszip'
import { createAst } from '@varlet/lowcode-ast'
import { Button as VarButton } from '@varlet/ui'
import { AssetProfile, AssetsManager, schemaManager } from '@varlet/lowcode-core'
import { saveAs } from 'file-saver'
import { isArray, isPlainObject, isString, kebabCase } from '@varlet/shared'
import '@varlet/ui/es/button/style/index.js'
import type { AssetProfileMaterial, Assets, SchemaNode, SchemaNodeSlot, SchemaPageNode } from '@varlet/lowcode-core'

const vueApis = [
  'ref',
  'reactive',
  'computed',
  'readonly',
  'watch',
  'watchEffect',
  'watchSyncEffect',
  'watchPostEffect',
  'isRef',
  'unref',
  'toRefs',
  'isProxy',
  'isReactive',
  'isReadonly',
  'onBeforeMount',
  'onMounted',
  'onBeforeUpdate',
  'onUpdated',
  'onBeforeUnmount',
  'onUnmounted',
]

const internalResourcesKeywords = ['varlet-lowcode-core', 'varlet-lowcode-renderer']

const getRendererWindow = () => Array.from(window).find((w) => w.name === 'rendererWindow') as any

const getRendererSchema = (): SchemaPageNode => {
  return getRendererWindow().VarletLowcodeRenderer.default.schema.value
}

const getRendererAssets = (): Assets => {
  return getRendererWindow().VarletLowcodeRenderer.default.assets.value
}

const getRendererAssetsManager = (): AssetsManager => {
  return getRendererWindow().VarletLowcodeCore.assetsManager
}

const { traverseSetupFunction, transformExpressionValue, transformNamedImports } = createAst(getRendererWindow)

const stringifyObject = (object: any[] | Record<string, any>): string => {
  return JSON.stringify(object).replace(/"(.+)":/g, '$1:')
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
      propsString += ` ${convertEventName(key)}="${transformExpressionValue(value.value)}"`

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
    return ` v-if="${transformExpressionValue(schemaNode.if.value)}"`
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
    return ` v-for="$item_${schemaNode.id} in ${transformExpressionValue(schemaNode.for.value)}"`
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

const genSchemaNode = (schemaNode: SchemaNode, depth: number): string => {
  const indent = ' '.repeat(depth * 2)

  if (schemaManager.isSchemaPageNode(schemaNode) && isArray(schemaNode.slots?.default.children)) {
    return schemaNode.slots!.default.children.map((schemaNode) => genSchemaNode(schemaNode, depth + 1)).join('\n')
  }

  if (schemaManager.isSchemaPageNode(schemaNode) && !isArray(schemaNode.slots?.default.children)) {
    return ''
  }

  if (schemaManager.isSchemaTextNode(schemaNode)) {
    if (schemaManager.isExpressionBinding(schemaNode.textContent)) {
      return `${indent}{{ ${transformExpressionValue(schemaNode.textContent.value)} }}`
    }
    return `${indent}${schemaNode.textContent}`
  }

  const material = getRendererAssetsManager().findMaterial(getRendererAssets(), schemaNode.name, schemaNode.library!)
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

const genVueApis = (seenApis: string[]) => {
  return vueApis
    .filter((api) => seenApis.includes(api))
    .map((api) => `  ${api}`)
    .join(',\n')
}

const genNamedImportNames = (library: string, namedImports: Record<string, string[]>) => {
  return `{ ${namedImports[library]
    .map((namedImport) => {
      return namedImport === 'default' ? `default as ${library}Default` : namedImport
    })
    .join(', ')} }`
}

const genApp = (
  profiles: AssetProfile[],
  seenApis: string[],
  allImportedApis: string[],
  code: string,
  namedImports: Record<string, string[]>
) => {
  const schema = getRendererSchema()
  const imports = getSetupUsedProfiles(profiles, seenApis)
    .map(({ library, packageName }) => {
      const allImport = allImportedApis.includes(library) ? `import * as ${library} from '${packageName}'\n` : ''

      const namedImport = namedImports[library]
        ? `import ${genNamedImportNames(library, namedImports)} from '${packageName}'`
        : ''

      return `${allImport}${namedImport}`
    })
    .join('\n')

  return `\
<template>
  <div class="varlet-low-code-page">
${genSchemaNode(schema, 1)}
  </div>
</template>

<script>
import {
  defineComponent,
${genVueApis(seenApis)}
} from 'vue'
${imports}

${code}
export default defineComponent({
  setup
})
<${'/'}script>
`
}

const genMain = (profiles: AssetProfile[]) => {
  const vuePlugins = profiles.filter(({ isVuePlugin }) => isVuePlugin)

  const imports = vuePlugins.map(({ library, packageName }) => `import ${library} from '${packageName}'\n`)

  const uses = vuePlugins.map(({ library }) => `.use(${library})\n  `)

  return `\
import App from './App.vue'
${imports}
import { createApp } from 'vue'

const app = createApp(App)

${uses.length ? 'app' : ''}${uses.join('')}
app.mount('#app')
`
}

const genPkg = (profiles: AssetProfile[]) => {
  const dependencies = profiles
    .map(({ packageName, packageVersion }) => `    "${packageName}": "${packageVersion}"`)
    .join(',\n')

  return pkg.replace(
    '"vite": "latest"',
    `\
"vite": "latest",
${dependencies}\
`
  )
}

const genIndex = () => {
  const resources = getRendererAssetsManager()
    .getResources(getRendererAssets(), true)
    .filter((resource) => !internalResourcesKeywords.some((keyword) => resource.includes(keyword)))

  const scripts = resources
    .filter((resource) => !resource.endsWith('.css'))
    .map((resource) => `    <script src="${resource}"><${'/'}script>`)
    .join('\n')

  const styles = resources
    .filter((resource) => resource.endsWith('css'))
    .map((resource) => `    <link ref="stylesheet" href="${resource}" />`)
    .join('\n')

  const indexTemplate = index.replace(
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `\
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${styles}`
  )

  return indexTemplate.replace(
    `    <script type="module" src="/src/main.js"><${'/'}script>`,
    `\
${scripts}
    <script type="module" src="/src/main.js"><${'/'}script>\
`
  )
}

const genConfig = (profiles: AssetProfile[]) => {
  const externals = profiles.map(({ library, packageName }) => `      '${packageName}': '${library}'`).join(',\n')

  return config.replace(
    '    viteExternalsPlugin()',
    `\
    viteExternalsPlugin({
      vue: 'Vue',
${externals}
    })`
  )
}

const getSetupUsedProfiles = (profiles: AssetProfile[], seenApis: string[]): AssetProfile[] => {
  return profiles.filter(({ library }) => seenApis.includes(library))
}

const save = async () => {
  const { seenApis, allImportedApis } = traverseSetupFunction(getRendererSchema().code ?? '')
  const profiles = getRendererAssetsManager().getProfiles(getRendererAssets())
  const setupUsedProfiles = getSetupUsedProfiles(profiles, seenApis)
  const libraries = setupUsedProfiles.map((profile) => profile.library)
  const { code, namedImports } = transformNamedImports(getRendererSchema().code!, libraries)

  const zip = new JSZip()

  zip.file('index.html', genIndex())
  zip.file('package.json', genPkg(profiles))
  zip.file('vite.config.js', genConfig(profiles))
  zip.file('README.md', readme)

  const src = zip.folder('src')!

  src.file('App.vue', genApp(profiles, seenApis, allImportedApis, code, namedImports))
  src.file('main.js', genMain(profiles))

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, 'vite-varlet-low-code-starter.zip')
}
</script>

<template>
  <div class="varlet-low-code-codegen">
    <var-button type="primary" @click="save">Codegen</var-button>
  </div>
</template>
