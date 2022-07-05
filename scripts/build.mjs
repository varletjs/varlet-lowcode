import execa from 'execa'
import ora from 'ora'
import { resolve } from 'path'

const CWD = process.cwd()
const PKG_CLI = resolve(CWD, './packages/varlet-lowcode-cli')
const PKG_CORE = resolve(CWD, './packages/varlet-lowcode-core')
const PKG_DESIGNER = resolve(CWD, './packages/varlet-lowcode-designer')
const PKG_DND = resolve(CWD, './packages/varlet-lowcode-dnd')
const PKG_PROFILE = resolve(CWD, './packages/varlet-lowcode-profile')
const PKG_RENDERER = resolve(CWD, './packages/varlet-lowcode-renderer')
const PKG_AST = resolve(CWD, './packages/varlet-lowcode-ast')
const PKG_CODEGEN = resolve(CWD, './packages/varlet-lowcode-codegen')
const PKG_MONACO = resolve(CWD, './packages/varlet-lowcode-monaco')
const PKG_CODE_EDITOR = resolve(CWD, './packages/varlet-lowcode-code-editor')
const PKG_SCHEMA_EDITOR = resolve(CWD, './packages/varlet-lowcode-schema-editor')
const PKG_SELECTOR = resolve(CWD, './packages/varlet-lowcode-selector')

export const buildCli = () => execa('pnpm', ['build'], { cwd: PKG_CLI })

export const buildCore = () => execa('pnpm', ['compile'], { cwd: PKG_CORE })

export const buildDnd = () => execa('pnpm', ['compile'], { cwd: PKG_DND })

export const buildDesigner = () => execa('pnpm', ['compile'], { cwd: PKG_DESIGNER })

export const buildProfile = () => execa('pnpm', ['compile'], { cwd: PKG_PROFILE })

export const buildRenderer = () => execa('pnpm', ['compile'], { cwd: PKG_RENDERER })

export const buildAst = () => execa('pnpm', ['compile'], { cwd: PKG_AST })

export const buildCodegen = () => execa('pnpm', ['compile'], { cwd: PKG_CODEGEN })

export const buildMonaco = () => execa('pnpm', ['compile'], { cwd: PKG_MONACO })

export const buildCodeEditor = () => execa('pnpm', ['compile'], { cwd: PKG_CODE_EDITOR })

export const buildSchemaEditor = () => execa('pnpm', ['compile'], { cwd: PKG_SCHEMA_EDITOR })

export const buildSelector = () => execa('pnpm', ['compile'], { cwd: PKG_SELECTOR })

export async function runTask(taskName, task) {
  const s = ora().start(`Building ${taskName}`)
  try {
    await task()
    s.succeed(`Build ${taskName} completed!`)
  } catch (e) {
    s.fail(`Build ${taskName} failed!`)
    console.error(e.toString())
  }
}
