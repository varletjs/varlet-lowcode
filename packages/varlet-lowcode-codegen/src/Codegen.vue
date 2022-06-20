<script setup lang="ts">
import index from './template/index.html?raw'
import pkg from './template/package.json?raw'
import config from './template/vite.config.js?raw'
import readme from './template/README.md?raw'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import JSZip from 'jszip'
import * as t from '@babel/types'
import '@varlet/ui/es/button/style/index.js'
import { Button as VarButton } from '@varlet/ui'
import { AssetsManager, schemaManager } from '@varlet/lowcode-core'
import { saveAs } from 'file-saver'
import { parse } from '@babel/parser'
import { isArray, isPlainObject, isString, kebabCase } from './shared'
import type {
  AssetProfileMaterial,
  Assets,
  SchemaNode,
  SchemaNodeSlot,
  SchemaPageNode,
  SchemaPageNodeSetupReturnDeclarations,
} from '@varlet/lowcode-core'

enum SetupReturnVariableDeclarationGroups {
  FUNCTION = 'function',
  VARIABLE = 'variable',
}

type Packages = Record<string, [string, string]>

const refCreators = ['ref', 'computed']
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

const getRendererWindow = () => window[0] as any

const getRendererSchema = (): SchemaPageNode => {
  return getRendererWindow().VarletLowcodeRenderer.default.schema.value
}

const getRendererAssets = (): Assets => {
  return getRendererWindow().VarletLowcodeRenderer.default.assets.value
}

const getRendererAssetsManager = (): AssetsManager => {
  return getRendererWindow().VarletLowcodeCore.assetsManager
}

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

  const rendererWindow = getRendererWindow()

  traverse(ast, {
    MemberExpression(path) {
      if (
        path.node.object.type === 'Identifier' &&
        path.node.property.type === 'Identifier' &&
        path.node.property.name === 'value'
      ) {
        if (rendererWindow.isRef(rendererWindow.eval(`${path.node.object.name}`))) {
          path.replaceWith(t.identifier(path.node.object.name))
        }
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

const genPackages = (): Packages => {
  const packages: Record<string, [string, string]> = {}

  schemaManager.visitSchemaNode(getRendererSchema(), (schemaNode) => {
    if (schemaManager.isSchemaPageNode(schemaNode) || schemaManager.isSchemaTextNode(schemaNode)) {
      return
    }

    const { packageName, packageVersion } = getRendererAssetsManager().findProfile(
      getRendererAssets(),
      schemaNode.name,
      schemaNode.library!
    )

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
      return `${indent}{{ ${convertExpressionValue(schemaNode.textContent.value)} }}`
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

const genVueApis = (setupCalledFunctions: string[]) => {
  return vueApis
    .filter((api) => setupCalledFunctions.includes(api))
    .map((api) => `  ${api}`)
    .join(',\n')
}

const genApp = (packages: Packages, setupCalledFunctions: string[], setupUsedLibraries: string[]) => {
  const schema = getRendererSchema()

  return `\
<template>
  <div class="varlet-low-code-page">
${genSchemaNode(schema, 1)}
  </div>
</template>

<script>
import {
  defineComponent,
${genVueApis(setupCalledFunctions)}
} from 'vue'
${genPackageImports(packages, setupUsedLibraries)}
${schema.code}
export default defineComponent({
  setup
})
<${'/'}script>
`
}

const genPackageImports = (packages: Packages, setupUsedLibraries?: string[]) => {
  return Object.entries(packages).map(([library, [packageName]]) => {
    if (isArray(setupUsedLibraries) && !setupUsedLibraries.includes(library)) {
      return ''
    }

    return `\
import ${library} from '${packageName}'
`
  })
}

const genMain = (packages: Packages) => {
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

const genPkg = (packages: Packages) => {
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
  const resources = getRendererAssetsManager().getResources(getRendererAssets())
  const scripts = resources.map((resource) => `    <script src="${resource}"><${'/'}script>`)

  return index.replace(
    `    <script type="module" src="/src/main.js"><${'/'}script>`,
    `\
${scripts.join('\n')}
    <script type="module" src="/src/main.js"><${'/'}script>\
`
  )
}

const genConfig = (packages: Packages) => {
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

const traverseSetupFunction = (packages: Packages) => {
  const schema = getRendererSchema()
  const libraries = Object.keys(packages)
  const errors: string[] = []
  const setupReturnVariables: string[] = []
  const setupUsedLibraries: string[] = []
  const setupReturnDeclarations: SchemaPageNodeSetupReturnDeclarations = {}
  const setupCalledFunctions: string[] = []

  const ast = parse(schema.code ?? '', {
    sourceType: 'module',
  })

  let hasSetup = false

  traverse(ast, {
    FunctionDeclaration(path) {
      if (path.node.id && path.node.id.type === 'Identifier' && path.node.id.name === 'setup') {
        hasSetup = true

        path.node.body.body.forEach((statement) => {
          if (statement.type === 'ReturnStatement') {
            if (statement.argument?.type === 'ObjectExpression') {
              statement.argument.properties.forEach((objectProperty) => {
                if (objectProperty.type === 'SpreadElement') {
                  errors.push('Codegen not support spread element')
                  return
                }

                if (objectProperty.key.type === 'Identifier') {
                  setupReturnVariables.push(objectProperty.key.name)
                }
              })
            }
          }
        })
      }
    },
  })

  if (!hasSetup) {
    errors.push('Setup function not found')
  }

  if (errors.length) {
    throw new Error(errors.join('\n'))
  }

  traverse(ast, {
    FunctionDeclaration(path) {
      if (path.node.id && path.node.id.type === 'Identifier' && path.node.id.name === 'setup') {
        path.node.body.body.forEach((statement) => {
          if (statement.type === 'VariableDeclaration') {
            statement.declarations.forEach((declaration) => {
              if (statement.kind !== 'const' && declaration.id.type === 'Identifier') {
                errors.push(
                  `For more accurate compile-time type inference, only const is allowed for variable definitions: ${declaration.id.name}`
                )
                return
              }

              if (declaration.id.type === 'Identifier') {
                if (!setupReturnVariables.includes(declaration.id.name)) {
                  return
                }

                if (declaration.init?.type === 'CallExpression' && declaration.init?.callee.type === 'Identifier') {
                  setupReturnDeclarations[declaration.init?.callee.name] = [
                    ...(setupReturnDeclarations[declaration.init?.callee.name] ?? []),
                    declaration.id.name,
                  ]
                } else if (declaration.init?.type === 'ArrowFunctionExpression') {
                  setupReturnDeclarations[SetupReturnVariableDeclarationGroups.FUNCTION] = [
                    ...(setupReturnDeclarations[SetupReturnVariableDeclarationGroups.FUNCTION] ?? []),
                    declaration.id.name,
                  ]
                } else {
                  setupReturnDeclarations[SetupReturnVariableDeclarationGroups.VARIABLE] = [
                    ...(setupReturnDeclarations[SetupReturnVariableDeclarationGroups.VARIABLE] ?? []),
                    declaration.id.name,
                  ]
                }
              }
            })
          }

          if (statement.type === 'FunctionDeclaration') {
            if (statement.id && statement.id.type === 'Identifier') {
              setupReturnDeclarations[SetupReturnVariableDeclarationGroups.FUNCTION] = [
                ...(setupReturnDeclarations[SetupReturnVariableDeclarationGroups.FUNCTION] ?? []),
                statement.id.name,
              ]
            }
          }
        })
      }
    },

    CallExpression(path) {
      if (path.node.callee.type === 'Identifier') {
        const functionName = path.node.callee.name

        if (!setupCalledFunctions.includes(functionName)) {
          setupCalledFunctions.push(functionName)
        }
      }
    },

    Identifier(path) {
      if (
        path.parent.type === 'MemberExpression' &&
        path.parent.property === path.node &&
        path.parent.object.type === 'Identifier' &&
        path.parent.object.name !== 'window'
      ) {
        return
      }

      const { name } = path.node

      if (libraries.includes(name) && !setupUsedLibraries.includes(name)) {
        setupUsedLibraries.push(name)
      }
    },

    MemberExpression(path) {
      if (
        path.node.object.type === 'Identifier' &&
        path.node.property.type === 'Identifier' &&
        path.node.object.name === 'window'
      ) {
        const propertyName = path.node.property.name
        if (libraries.includes(propertyName) && !setupUsedLibraries.includes(propertyName)) {
          setupUsedLibraries.push(propertyName)
        }
      }

      if (
        path.node.object.type === 'Identifier' &&
        path.node.property.type === 'Identifier' &&
        path.node.object.name === 'window'
      ) {
        const propertyName = path.node.property.name
        if (libraries.includes(propertyName) && !setupUsedLibraries.includes(propertyName)) {
          setupUsedLibraries.push(propertyName)
        }
      }
    },
  })

  if (errors.length) {
    throw new Error(errors.join('\n'))
  }

  return {
    setupReturnDeclarations,
    setupCalledFunctions,
    setupUsedLibraries,
  }
}

const save = async () => {
  const packages = genPackages()
  const { setupCalledFunctions, setupUsedLibraries } = traverseSetupFunction(packages)
  const zip = new JSZip()

  zip.file('index.html', genIndex())
  zip.file('package.json', genPkg(packages))
  zip.file('vite.config.js', genConfig(packages))
  zip.file('README.md', readme)

  const src = zip.folder('src')!

  src.file('App.vue', genApp(packages, setupCalledFunctions, setupUsedLibraries))
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
