import './shim/buffer'
import './shim/process'
import { uniq } from '@varlet/shared'
import { parse } from '@babel/parser'
import babel from '@babel/standalone'
import traverse, { NodePath } from '@babel/traverse'
import generate from '@babel/generator'
import * as t from '@babel/types'
import type { MemberExpression, OptionalMemberExpression, VariableDeclarator } from '@babel/types'
import type { SchemaPageNodeSetupReturnDeclarations } from '@varlet/lowcode-core'

function uniqConcat(arr: any[], ...items: any) {
  return arr ? uniq([...arr, ...items]) : [...items]
}

export enum SetupReturnVariableDeclarationGroups {
  FUNCTION = 'function',
  VARIABLE = 'variable',
}

export function createAst(rendererWindowGetter?: () => any) {
  function transformExpressionValue(value: string) {
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
          t.isIdentifier(path.node.object) &&
          t.isIdentifier(path.node.property) &&
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

  function traverseFunction(code: string, name = 'setup') {
    const errors: string[] = []
    const seenApis: string[] = []
    const allImportedApis: string[] = []
    const returnDeclarations: SchemaPageNodeSetupReturnDeclarations = {}

    const ast = parse(code, {
      sourceType: 'module',
    })

    let foundFunctionName = false
    const waitConfirmVariableValueToKeys: Record<string, string[]> = {}

    traverse(ast, {
      FunctionDeclaration(path) {
        if (t.isIdentifier(path.node.id) && path.node.id.name === name) {
          foundFunctionName = true

          path.node.body.body.forEach((statement) => {
            if (t.isReturnStatement(statement)) {
              if (t.isObjectExpression(statement.argument)) {
                statement.argument.properties.forEach((property) => {
                  if (t.isSpreadElement(property)) {
                    return
                  }

                  if (t.isObjectProperty(property) && t.isIdentifier(property.key) && t.isIdentifier(property.value)) {
                    waitConfirmVariableValueToKeys[property.value.name] = uniqConcat(
                      waitConfirmVariableValueToKeys[property.value.name],
                      property.key.name
                    )
                  }

                  if (t.isObjectProperty(property) && t.isIdentifier(property.key) && !t.isIdentifier(property.value)) {
                    returnDeclarations[SetupReturnVariableDeclarationGroups.VARIABLE] = uniqConcat(
                      returnDeclarations[SetupReturnVariableDeclarationGroups.VARIABLE],
                      property.key.name
                    )
                  }

                  if (t.isObjectMethod(property) && t.isIdentifier(property.key)) {
                    returnDeclarations[SetupReturnVariableDeclarationGroups.FUNCTION] = uniqConcat(
                      returnDeclarations[SetupReturnVariableDeclarationGroups.FUNCTION],
                      property.key.name
                    )
                  }
                })
              }
            }
          })
        }
      },
    })

    if (!foundFunctionName) {
      errors.push(`SyntaxError: ${name} function not found`)
    }

    if (errors.length) {
      throw new Error(errors.join('\n'))
    }

    function resolveDeclarationNames(declaration: VariableDeclarator) {
      let names: string[] = []

      // e.g. const count = ?
      if (t.isIdentifier(declaration.id)) {
        names = [declaration.id.name]
      }

      // e.g. const {} = ?
      if (t.isObjectPattern(declaration.id)) {
        names = declaration.id.properties
          .map((property) => {
            // e.g. const { count } = ?
            if (t.isObjectProperty(property) && t.isIdentifier(property.value)) {
              return property.value.name
            }

            // e.g. const { count, ...rest } = ?
            if (t.isRestElement(property) && t.isIdentifier(property.argument)) {
              return property.argument.name
            }

            return ''
          })
          .filter(Boolean) as string[]
      }

      // e.g. const [] = ?
      if (t.isArrayPattern(declaration.id)) {
        names = declaration.id.elements
          .map((element) => {
            // e.g const [count] = ?
            if (t.isIdentifier(element)) {
              return element.name
            }

            // e.g const [count, ...rest] = ?
            if (t.isRestElement(element) && t.isIdentifier(element.argument)) {
              return element.argument.name
            }

            return ''
          })
          .filter(Boolean) as string[]
      }

      names = names
        .filter((name) => waitConfirmVariableValueToKeys[name])
        .map((name) => waitConfirmVariableValueToKeys[name])
        .flat()

      return names
    }

    function resolveApis(path: NodePath<MemberExpression | OptionalMemberExpression>) {
      if (t.isIdentifier(path.node.object) && t.isIdentifier(path.node.property)) {
        let identifier

        if (path.node.object.name === 'window') {
          identifier = path.node.property.name
          if (
            !t.isMemberExpression(path.parent) &&
            !t.isOptionalMemberExpression(path.parent) &&
            !allImportedApis.includes(identifier)
          ) {
            allImportedApis.push(identifier)
          }
        } else {
          identifier = path.node.object.name
        }

        if (!seenApis.includes(identifier)) {
          seenApis.push(identifier)
        }
      }
    }

    traverse(ast, {
      FunctionDeclaration(path) {
        if (t.isIdentifier(path.node.id) && path.node.id.name === name) {
          path.node.body.body.forEach((statement) => {
            if (t.isVariableDeclaration(statement)) {
              statement.declarations.forEach((declaration) => {
                // e.g. ()
                // e.g. ?.()
                if (t.isCallExpression(declaration.init) || t.isOptionalCallExpression(declaration.init)) {
                  // e.g. ref()
                  if (t.isIdentifier(declaration.init?.callee)) {
                    returnDeclarations[declaration.init?.callee.name] = uniqConcat(
                      returnDeclarations[declaration.init?.callee.name],
                      ...resolveDeclarationNames(declaration)
                    )
                  }
                  // e.g. a.ref?.()
                  // e.g. a?.ref?.()
                  else if (
                    t.isMemberExpression(declaration.init?.callee) ||
                    t.isOptionalMemberExpression(declaration.init?.callee)
                  ) {
                    if (t.isIdentifier(declaration.init?.callee.property)) {
                      returnDeclarations[declaration.init?.callee.property.name] = uniqConcat(
                        returnDeclarations[declaration.init?.callee.property.name],
                        ...resolveDeclarationNames(declaration)
                      )
                    }
                  }
                }
                // e.g. () => {},
                // e.g. function() {}
                else if (t.isArrowFunctionExpression(declaration.init) || t.isFunctionExpression(declaration.init)) {
                  returnDeclarations[SetupReturnVariableDeclarationGroups.FUNCTION] = uniqConcat(
                    returnDeclarations[SetupReturnVariableDeclarationGroups.FUNCTION],
                    ...resolveDeclarationNames(declaration)
                  )
                }
                // e.g. Literal, [], {}
                else {
                  returnDeclarations[SetupReturnVariableDeclarationGroups.VARIABLE] = uniqConcat(
                    returnDeclarations[SetupReturnVariableDeclarationGroups.VARIABLE],
                    ...resolveDeclarationNames(declaration)
                  )
                }
              })
            }

            // e.g. function a() {}
            if (t.isFunctionDeclaration(statement)) {
              if (t.isIdentifier(statement.id)) {
                returnDeclarations[SetupReturnVariableDeclarationGroups.FUNCTION] = uniqConcat(
                  returnDeclarations[SetupReturnVariableDeclarationGroups.FUNCTION],
                  statement.id.name
                )
              }
            }
          })
        }
      },

      Identifier(path) {
        // e.g. Varlet
        if (
          !t.isMemberExpression(path.parent) &&
          !t.isOptionalMemberExpression(path.parent) &&
          !t.isFunctionDeclaration(path.parent)
        ) {
          const { name } = path.node

          if (!seenApis.includes(name)) {
            seenApis.push(name)
          }

          if (!allImportedApis.includes(name)) {
            allImportedApis.push(name)
          }
        }
      },

      MemberExpression(path) {
        // e.g. window.Varlet.xxx
        // e.g. Varlet.xxx
        resolveApis(path)
      },

      OptionalMemberExpression(path) {
        // e.g. window.Varlet?.???
        // e.g. Varlet?.???
        resolveApis(path)
      },
    })

    return {
      returnDeclarations,
      seenApis,
      allImportedApis,
    }
  }

  function transformNamedImports(code: string, identifiers: string[]) {
    const namedImports: Record<string, string[]> = {}

    const ast = parse(code, {
      sourceType: 'module',
    })

    function transformNamedExport(path: NodePath<MemberExpression | OptionalMemberExpression>) {
      if (t.isIdentifier(path.node.object) && t.isIdentifier(path.node.property)) {
        if (path.node.object.name === 'window') {
          const identifier = path.node.property.name

          if (t.isMemberExpression(path.parent) || t.isOptionalMemberExpression(path.parent)) {
            if (t.isIdentifier(path.parent.property) && identifiers.includes(identifier)) {
              const namedImport = path.parent.property.name

              path.parentPath.replaceWith(
                t.identifier(namedImport === 'default' ? `${identifier}Default` : namedImport)
              )

              namedImports[identifier] = uniqConcat(namedImports[identifier], namedImport)
            }
          } else {
            // e.g. window.Varlet
            path.replaceWith(t.identifier(identifier))
          }
        } else {
          const identifier = path.node.object.name

          if (identifiers.includes(identifier)) {
            const namedImport = path.node.property.name
            path.replaceWith(t.identifier(namedImport === 'default' ? `${identifier}Default` : namedImport))

            namedImports[identifier] = uniqConcat(namedImports[identifier], namedImport)
          }
        }
      }
    }

    traverse(ast, {
      MemberExpression(path) {
        // e.g. window.Varlet.xxx() -> xxx()
        // e.g. Varlet.xxx -> xxx()
        transformNamedExport(path)
      },

      OptionalMemberExpression(path) {
        // e.g. window.Varlet?.xxx?.() -> xxx?.()
        // e.g. Varlet?.xxx?.() -> xxx?.()
        transformNamedExport(path)
      },
    })

    return {
      code: generate(ast, { retainLines: true }).code,
      namedImports,
    }
  }

  function transformCompatibleCode(code: string) {
    return babel.transform(code, {
      targets: {
        chrome: '51',
        ios: '10',
      },
      sourceType: 'unambiguous',
      presets: ['env'],
    }).code
  }

  return {
    traverseFunction,
    transformCompatibleCode,
    transformExpressionValue,
    transformNamedImports,
  }
}
