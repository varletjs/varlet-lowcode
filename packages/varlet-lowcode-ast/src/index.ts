import './shim/buffer'
import './shim/process'
import { uniq } from '@varlet/shared'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import * as t from '@babel/types'
import type { VariableDeclarator } from '@babel/types'
import type { SchemaPageNodeSetupReturnDeclarations } from '@varlet/lowcode-core'

export enum SetupReturnVariableDeclarationGroups {
  FUNCTION = 'function',
  VARIABLE = 'variable',
}

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

  function traverseSetupFunction(code: string) {
    const errors: string[] = []
    const setupReturnVariables: string[] = []
    const setupTopLevelIdentifiers: string[] = []
    const setupReturnDeclarations: SchemaPageNodeSetupReturnDeclarations = {}

    const ast = parse(code, {
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

    function resolveDeclarationNames(declaration: VariableDeclarator) {
      // e.g. const count = ?
      if (declaration.id.type === 'Identifier') {
        return [declaration.id.name]
      }

      // e.g. const {} = ?
      if (declaration.id.type === 'ObjectPattern') {
        return declaration.id.properties
          .map((property) => {
            // e.g. const { count } = ?
            if (property.type === 'ObjectProperty' && property.value.type === 'Identifier') {
              return property.value.name
            }

            // e.g. const { count, ...rest } = ?
            if (property.type === 'RestElement' && property.argument.type === 'Identifier') {
              return property.argument.name
            }

            return ''
          })
          .filter(Boolean) as string[]
      }

      // e.g. const [] = ?
      if (declaration.id.type === 'ArrayPattern') {
        return declaration.id.elements
          .map((element) => {
            // e.g const [count] = ?
            if (element && element.type === 'Identifier') {
              return element.name
            }

            // e.g const [count, ...rest] = ?
            if (element && element.type === 'RestElement' && element.argument.type === 'Identifier') {
              return element.argument.name
            }

            return ''
          })
          .filter(Boolean) as string[]
      }

      return []
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

                // e.g. ()
                // e.g. ?.()
                if (
                  declaration.init?.type === 'CallExpression' ||
                  declaration.init?.type === 'OptionalCallExpression'
                ) {
                  // e.g. ref()
                  if (declaration.init?.callee.type === 'Identifier') {
                    setupReturnDeclarations[declaration.init?.callee.name] = uniq([
                      ...(setupReturnDeclarations[declaration.init?.callee.name] ?? []),
                      ...resolveDeclarationNames(declaration),
                    ])
                  }
                  // e.g. a.ref?.()
                  // e.g. a?.ref?.()
                  else if (
                    declaration.init?.callee.type === 'MemberExpression' ||
                    declaration.init?.callee.type === 'OptionalMemberExpression'
                  ) {
                    if (declaration.init?.callee.property.type === 'Identifier') {
                      setupReturnDeclarations[declaration.init?.callee.property.name] = uniq([
                        ...(setupReturnDeclarations[declaration.init?.callee.property.name] ?? []),
                        ...resolveDeclarationNames(declaration),
                      ])
                    }
                  }
                }
                // e.g. () => {},
                // e.g. function() {}
                else if (
                  declaration.init?.type === 'ArrowFunctionExpression' ||
                  declaration.init?.type === 'FunctionExpression'
                ) {
                  setupReturnDeclarations[SetupReturnVariableDeclarationGroups.FUNCTION] = uniq([
                    ...(setupReturnDeclarations[SetupReturnVariableDeclarationGroups.FUNCTION] ?? []),
                    ...resolveDeclarationNames(declaration),
                  ])
                }
                // e.g. Literal, [], {}
                else {
                  setupReturnDeclarations[SetupReturnVariableDeclarationGroups.VARIABLE] = uniq([
                    ...(setupReturnDeclarations[SetupReturnVariableDeclarationGroups.VARIABLE] ?? []),
                    ...resolveDeclarationNames(declaration),
