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

export const buildCli = () => execa('pnpm', ['build'], { cwd: PKG_CLI })

export const buildCore = () => execa('pnpm', ['compile'], { cwd: PKG_CORE })

export const buildDnd = () => execa('pnpm', ['compile'], { cwd: PKG_DND })

export const buildDesigner = () => execa('pnpm', ['compile'], { cwd: PKG_DESIGNER })

export const buildProfile = () => execa('pnpm', ['compile'], { cwd: PKG_PROFILE })

export const buildRenderer = () => execa('pnpm', ['compile'], { cwd: PKG_RENDERER })

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
