<script setup lang="ts">
import index from './template/index.html?raw'
import pkg from './template/package.json?raw'
import config from './template/vite.config.js?raw'
import readme from './template/README.md?raw'
import JSZip from 'jszip'
import prettier from 'prettier/esm/standalone.mjs'
import parserBabel from 'prettier/esm/parser-babel.mjs'
import parserHtml from 'prettier/esm/parser-html.mjs'
import { saveAs } from 'file-saver'
import { createAst } from '@varlet/lowcode-ast'
import { Button as VarButton } from '@varlet/ui'
import { localeManager, schemaManager, SchemaNodeIn } from '@varlet/lowcode-core'
import { cloneDeep } from 'lodash-es'
import { isArray, isPlainObject, isString, kebabCase, uniq } from '@varlet/shared'
import '@varlet/ui/es/button/style/index.js'
import _stringifyObject from './utils/stringifyObject.js'
import type {
  AssetProfile,
  AssetProfileMaterial,
  Assets,
  AssetsManager,
  SchemaNode,
  SchemaNodeSlot,
  SchemaPageNode,
  SchemaPageNodeDataSource,
} from '@varlet/lowcode-core'

const { t } = localeManager.useLocale({
  'zh-CN': {
    codegen: '出码',
  },
  'en-US': {
    codegen: 'CODEGEN',
  },
})

const vueApis = [
  'h',
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

const hasSlotProps = (schemaNode: SchemaNode, slotName: string) => {
  const material = getRendererMaterial(schemaNode)

  return material.slots?.find((slot) => slot.name === slotName)?.hasSlotProps ?? false
}

const formatCode = (code: string, parser = 'vue') => {
  return prettier.format(code, {
    parser,
    semi: false,
    singleQuote: true,
    plugins: [parserBabel, parserHtml],
  })
}

const stringifyObject = (...args: any[]) => {
  return _stringifyObject(...args)
    .replaceAll("'____####", '')
    .replaceAll("####____'", '')
    .replaceAll("\\'", "'")
}

const getRendererWindow = () => Array.from(window).find((w) => w.name === 'rendererWindow') as any

const getRendererSchema = (): SchemaPageNode => {
  return getRendererWindow().VarletLowcodeRenderer.default.schema.value
}

const getRendererAssets = (): Assets => {
  return getRendererWindow().VarletLowcodeRenderer.default.assets.value
}

const getRendererMaterial = (schemaNode: SchemaNode): AssetProfileMaterial => {
  return getRendererAssetsManager().findMaterial(getRendererAssets(), schemaNode.name, schemaNode.library!)
}

const getRendererAssetsManager = (): AssetsManager => {
  return getRendererWindow().VarletLowcodeCore.assetsManager
}

const { traverseFunction, transformExpressionValue, transformNamedImports } = createAst(getRendererWindow)

const convertExpressionBindingPropName = (key: string, schemaNode: SchemaNode, ignoreKeys: string[]) => {
  const { props = {}, models = [] } = schemaNode

  // props
  if (!key.startsWith('on')) {
    const updateFunctionName = `onUpdate:${key}`
    const isTwoWayBinding = props.hasOwnProperty(updateFunctionName) && models.includes(key)

    if (isTwoWayBinding) {
      ignoreKeys.push(updateFunctionName)

      return key === 'modelValue' ? 'v-model' : `v-model:${key}`
    }

    return `:${kebabCase(key)}`
  }

  // events
  const eventName = kebabCase(key.slice(2))

  return `@${eventName[0]!.toLowerCase()}${eventName.slice(1)}`
}

const normalizeObject = (record: Record<string, any> | any[], seenLibraries: Set<string>) => {
  const clonedRecord = cloneDeep(record)

  for (const [key, value] of Object.entries(clonedRecord)) {
    if (schemaManager.isRenderBinding(value)) {
      Reflect.set(clonedRecord, key, `____####${genRender(value.renderId, value.value, seenLibraries)}####____`)
    }

    if (schemaManager.isExpressionBinding(value)) {
      Reflect.set(clonedRecord, key, `____####${transformExpressionValue(value.value)}####____`)
    }

    if (schemaManager.isObjectBinding(value) || isArray(value)) {
      Reflect.set(clonedRecord, key, normalizeObject(value, seenLibraries))
    }
  }

  return clonedRecord
}

const genProps = (schemaNode: SchemaNode, seenLibraries: Set<string>): string => {
  const ignoreKeys: string[] = []

  return Object.entries(schemaNode.props ?? {}).reduce((propsString, [key, value]) => {
    if (ignoreKeys.includes(key)) {
      return propsString
    }

    if (schemaManager.isExpressionBinding(value)) {
      propsString += ` ${convertExpressionBindingPropName(key, schemaNode, ignoreKeys)}="${transformExpressionValue(
        value.value
      )}"`

      return propsString
    }

    if (schemaManager.isObjectBinding(value) || isArray(value)) {
      propsString += ` :${key}="${stringifyObject(normalizeObject(value, seenLibraries))}"`

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
  if (!schemaNode.hasOwnProperty('if')) {
    return ''
  }

  if (schemaManager.isExpressionBinding(schemaNode.if)) {
    return ` v-if="${transformExpressionValue(schemaNode.if.value)}"`
  }

  if (schemaManager.isObjectBinding(schemaNode.if) || isArray(schemaNode.if)) {
    return ` v-if="${stringifyObject(schemaNode.if)}"`
  }

  if (isString(schemaNode.if)) {
    return ` v-if="'${schemaNode.if}'"`
  }

  return ` v-if="${schemaNode.if}"`
}

const genLoop = (schemaNode: SchemaNode): string => {
  if (!schemaNode.hasOwnProperty('for')) {
    return ''
  }

  if (schemaManager.isExpressionBinding(schemaNode.for)) {
    return ` v-for="($item_${schemaNode.id}, $index_${schemaNode.id}) in ${transformExpressionValue(
      schemaNode.for.value
    )}"`
  }

  if (schemaManager.isObjectBinding(schemaNode.for) || isArray(schemaNode.for)) {
    return ` v-for="($item_${schemaNode.id}, $index_${schemaNode.id}) in ${stringifyObject(schemaNode.for)}"`
  }

  if (isString(schemaNode.for)) {
    return ` v-for="($item_${schemaNode.id}, $index_${schemaNode.id}) in '${schemaNode.for}'"`
  }

  return ` v-for="($item_${schemaNode.id}, $index_${schemaNode.id}) in ${schemaNode.for}"`
}

const genSlots = (
  schemaNodeSlots: Record<string, SchemaNodeSlot>,
  schemaNode: SchemaNode,
  seenLibraries: Set<string>
) => {
  return Object.entries(schemaNodeSlots)
    .map(([slotName, slot]) => {
      const slotPropsVariable = hasSlotProps(schemaNode, slotName) ? `="$slotProps_${schemaNode.id}"` : ''

      if (slotName === 'default' && !hasSlotProps) {
        return slot.children.map((schemaNode) => genTag(schemaNode, seenLibraries)).join('\n')
      }

      return `\
  <template #${slotName}${slotPropsVariable}>
${slot.children.map((schemaNode) => genTag(schemaNode, seenLibraries)).join('\n')}</template>`
    })
    .join('\n')
}

const genTag = (schemaNode: SchemaNode, seenLibraries: Set<string>): string => {
  if (schemaManager.isSchemaPageNode(schemaNode) && isArray(schemaNode.slots?.default.children)) {
    return schemaNode.slots!.default.children.map((schemaNode) => genTag(schemaNode, seenLibraries)).join('\n')
  }

  if (schemaManager.isSchemaPageNode(schemaNode) && !isArray(schemaNode.slots?.default.children)) {
    return ''
  }

  if (schemaManager.isSchemaTextNode(schemaNode)) {
    if (schemaManager.isExpressionBinding(schemaNode.textContent)) {
      return `{{ ${transformExpressionValue(schemaNode.textContent.value)} }}`
    }
    return schemaNode.textContent
  }

  const { name } = getRendererMaterial(schemaNode).codegen

  if (!isPlainObject(schemaNode.slots)) {
    return `<${name}${genProps(schemaNode, seenLibraries)}${genCondition(schemaNode)}${genLoop(schemaNode)} />`
  }

  return `<${name}${genProps(schemaNode, seenLibraries)}${genCondition(schemaNode)}${genLoop(schemaNode)}>\n${genSlots(
    schemaNode.slots,
    schemaNode,
    seenLibraries
  )}\n</${name}>`
}

const genVueApis = (seenApis: string[]) => {
  return vueApis
    .filter((api) => seenApis.includes(api))
    .map((api) => `  ${api}`)
    .join(',\n')
}

const genNamedImportMembers = (library: string, namedImports: Record<string, string[]>) => {
  return `{ ${namedImports[library]
    .map((namedImport) => {
      return namedImport === 'default' ? `default as ${library}Default` : namedImport
    })
    .join(', ')} }`
}

const genImports = (profiles: AssetProfile[], namedImports: Record<string, string[]>, allImportedApis: string[]) => {
  return profiles
    .map(({ library, packageName }) => {
      const allImport = allImportedApis.includes(library) ? `import * as ${library} from '${packageName}'\n` : ''

      const namedImport = namedImports[library]
        ? `import ${genNamedImportMembers(library, namedImports)} from '${packageName}'\n`
        : ''

      return `${allImport}${namedImport}`
    })
    .join('')
}

const genSlotsRender = (schemaNode: SchemaNode, seenLibraries: Set<string>) => {
  let start = '{'

  for (const [slotName, slot] of Object.entries(schemaNode.slots ?? {})) {
    const slotProps = hasSlotProps(schemaNode, slotName) ? `$slotProps_${schemaNode.id}` : ''
    const schemaNodeHs = slot.children.map((schemaNode) => genH(schemaNode, seenLibraries))

    start += `\n${slotName}: (${slotProps}) => [${schemaNodeHs}],`
  }

  start += '\n}'

  return start
}

const genH = (schemaNode: SchemaNode, seenLibraries: Set<string>) => {
  if (schemaManager.isSchemaTextNode(schemaNode)) {
    if (schemaManager.isExpressionBinding(schemaNode.textContent)) {
      return `${transformExpressionValue(schemaNode.textContent.value)}`
    }
    return `${schemaNode.textContent}`
  }

  seenLibraries.add(schemaNode.library!)

  const props = stringifyObject(normalizeObject(schemaNode.props ?? {}, seenLibraries))
  const slots = genSlotsRender(schemaNode, seenLibraries)

  return `\
h(${schemaNode.library}.${schemaNode.name}, ${props}, ${slots})
`
}

const genRender = (renderId: string, schemaNodes: SchemaNode[], seenLibraries: Set<string>) => {
  const schemaNodeHs = schemaNodes.map((schemaNode: SchemaNode) => genH(schemaNode, seenLibraries))
  const renderArgs = `...$renderArgs_${renderId}`

  return `
function render_${renderId}(${renderArgs}) {
  return [${schemaNodeHs}]
}
`.replaceAll('\n', '')
}

const withReturn = (code: string, returns: string[]) =>
  code.replace(/(return\s*\{(.|\s)+)(?!return)\}(.|\s)*\}\s*$/, `$1,\n${returns}}}`)

const genApp = (schema: SchemaPageNode, profiles: AssetProfile[]) => {
  const libraries = profiles.map((profile) => profile.library)
  const { seenApis, allImportedApis } = traverseFunction(schema.code ?? '')
  const transformed = transformNamedImports(schema.code ?? '', libraries)
  const tagTreeSeenLibraries = new Set<string>()
  const tagTree = genTag(schema, tagTreeSeenLibraries)

  let { code } = transformed

  if (tagTreeSeenLibraries.size > 0) {
    code = withReturn(code, ['h', ...tagTreeSeenLibraries])
    seenApis.push('h')
  }

  const vueImports = `import { defineComponent, ${genVueApis(seenApis)} } from 'vue'`
  const librariesImports = genImports(
    profiles,
    transformed.namedImports,
    uniq([...allImportedApis, ...tagTreeSeenLibraries])
  )
  const dataSourcesImport = `${
    seenApis.includes('useDataSources') ? "import { useDataSources } from './dataSources'" : ''
  }`

  const template = formatCode(`\
<template>
  <div class="varlet-low-code-page">
${tagTree}
  </div>
</template>
`)

  const script = formatCode(
    `
${vueImports}
${librariesImports}
${dataSourcesImport}

${code}

export default defineComponent({
  setup
})`,
    'babel'
  )

  const style = formatCode(schema.css ? `\n<style>\n${schema.css}\n</style>` : '', 'vue')

  return `\
${template}
<script>
${script}\
<${'/'}script>

${style}
`
}

const genMain = (profiles: AssetProfile[]) => {
  const vuePlugins = profiles.filter(({ isVuePlugin }) => isVuePlugin)

  const imports = vuePlugins.map(({ library, packageName }) => `import ${library} from '${packageName}'`).join('\n')

  const uses = vuePlugins.map(({ library }) => `.use(${library})`)

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

const getDataSourcesDeps = (dataSources: SchemaPageNodeDataSource[], profiles: AssetProfile[]) => {
  const seenApis: string[] = []
  const allImportedApis: string[] = []

  dataSources.forEach(({ successHandler, errorHandler }) => {
    if (schemaManager.isExpressionBinding(successHandler)) {
      const { seenApis: successHandlerSeenApis, allImportedApis: successHandlerAllImportedApis } = traverseFunction(
        successHandler.value,
        'successHandler'
      )

      seenApis.push(...successHandlerSeenApis)
      allImportedApis.push(...successHandlerAllImportedApis)
    }

    if (schemaManager.isExpressionBinding(errorHandler)) {
      const { seenApis: errorHandlerSeenApis, allImportedApis: errorHandlerAllImportedApis } = traverseFunction(
        errorHandler.value,
        'errorHandler'
      )

      seenApis.push(...errorHandlerSeenApis)
      allImportedApis.push(...errorHandlerAllImportedApis)
    }
  })

  return {
    profiles: profiles.filter(({ library }) => seenApis.includes(library)),
    allImportedApis,
  }
}

const mergeNamedImports = (target: Record<string, string[]>, source: Record<string, string[]>) => {
  const keys = [...Object.keys(target), ...Object.keys(source)]

  return keys.reduce((ret, key) => {
    ret[key] = uniq([...(target[key] ?? []), ...(source[key] ?? [])])

    return ret
  }, {} as Record<string, string[]>)
}

const genDataSources = (dataSources: SchemaPageNodeDataSource[], profiles: AssetProfile[]) => {
  const { profiles: usedProfiles, allImportedApis } = getDataSourcesDeps(dataSources, profiles)
  const usedLibraries = usedProfiles.map((profile) => profile.library)
  const apiNames = dataSources.map(({ name }) => `    ['${name}', ${name}Api]`).join(',\n')

  let namedImports: Record<string, string[]> = {}

  const apis = dataSources
    .map(({ name, url, method, headers, timeout, withCredentials, successHandler, errorHandler }) => {
      const shouldMergeOptions = timeout || headers
      const mergedOptions = `{
    ...options,\
${timeout ? `\n    timeout: ${timeout},` : ''}\
${withCredentials ? `\n    withCredentials: ${withCredentials},` : ''}\
${headers ? `\n    headers: ${stringifyObject(headers, null, 6).replace(/\}$/, '    }')}` : ''}
  }
`
      let successHandlerTemplate = ''
      let errorHandlerTemplate = ''

      if (schemaManager.isExpressionBinding(successHandler)) {
        const { code, namedImports: successHandlerNamedImports } = transformNamedImports(
          successHandler.value,
          usedLibraries
        )

        successHandlerTemplate = `response = ${code.startsWith('async') ? 'await ' : ''}(${code})(response)\n`
        namedImports = mergeNamedImports(namedImports, successHandlerNamedImports)
      }

      if (schemaManager.isExpressionBinding(errorHandler)) {
        const { code, namedImports: errorHandlerNamedImports } = transformNamedImports(
          errorHandler.value,
          usedLibraries
        )

        errorHandlerTemplate = `return ${code.startsWith('async') ? 'await ' : ''}(${code})(e)`
        namedImports = mergeNamedImports(namedImports, errorHandlerNamedImports)
      }

      const withErrorHandlerTemplate = `\
  try {
    let response = await axle.helpers.${method}('${url}', params, options)

    ${successHandlerTemplate}\

    return response
  } catch(e) {
    ${errorHandlerTemplate}
  }`

      const withoutErrorHandlerTemplate = `\
  let response = await axle.helpers.${method}('${url}', params, options)

  ${successHandlerTemplate}\

  return response`

      return `\
export async function ${name}Api(params, options) {
${shouldMergeOptions ? `  options = ${mergedOptions}\n` : ''}\
${schemaManager.isExpressionBinding(errorHandler) ? withErrorHandlerTemplate : withoutErrorHandlerTemplate}
}`
    })
    .join('\n')

  const imports = genImports(usedProfiles, namedImports, allImportedApis)

  return `\
import { reactive } from 'vue'
import { createAxle } from '@varlet/axle'
${imports}

const axle = createAxle({})

${apis}

export function useDataSources() {
  return [\n${apiNames}\n  ].reduce((dataSources, [name, api]) => {
    const dataSource = reactive({
      value: undefined,
      async load(params, options) {
        const value = await api(params, options)

        dataSource.value = value

        return value
      }
    })

    dataSources[name] = dataSource

    return dataSources
  }, {})
}
`
}

const save = async () => {
  const rendererSchema = getRendererSchema()
  const profiles = getRendererAssetsManager().getProfiles(getRendererAssets())

  const zip = new JSZip()

  zip.file('index.html', genIndex())
  zip.file('package.json', genPkg(profiles))
  zip.file('vite.config.js', formatCode(genConfig(profiles), 'babel'))
  zip.file('README.md', readme)

  const src = zip.folder('src')!

  if (isArray(rendererSchema.dataSources) && rendererSchema.dataSources.length > 0) {
    src.file('dataSources.js', formatCode(genDataSources(rendererSchema.dataSources, profiles), 'babel'))
  }

  src.file('App.vue', genApp(rendererSchema, profiles))
  src.file('main.js', formatCode(genMain(profiles), 'babel'))

  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, 'vite-varlet-low-code-starter.zip')
}
</script>

<template>
  <div class="varlet-low-code-codegen">
    <var-button type="primary" @click="save">{{ t('codegen') }}</var-button>
  </div>
</template>
