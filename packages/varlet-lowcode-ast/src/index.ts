import './shim/buffer'
import './shim/process'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import * as t from '@babel/types'
import { parse } from '@babel/parser'
import type { SchemaPageNode, SchemaPageNodeSetupReturnDeclarations } from '@varlet/lowcode-core'

export enum SetupReturnVariableDeclarationGroups {
  FUNCTION = 'function',
  VARIABLE = 'variable',
}

export type Packages = Record<string, [string, string]>

export function createAst(rendererWindowGetter?: () => any) {
  function convertExpressionValue(value: string) {
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
          if (rendererWindowGetter?.().isRef(rendererWindowGetter().eval(`${path.node.object.name}`))) {
            path.replaceWith(t.identifier(path.node.object.name))
          }
        }
      },
    })

    const { code } = generate(ast)

    return code.endsWith(';') ? code.slice(0, -1) : code
  }

  function traverseSetupFunction(schema: SchemaPageNode, packages: Packages) {
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

  return {
    convertExpressionValue,
    traverseSetupFunction,
  }
}
