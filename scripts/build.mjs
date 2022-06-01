import execa from 'execa'
import ora from 'ora'
import { resolve } from 'path'

const CWD = process.cwd()
const PKG_CLI = resolve(CWD, './packages/varlet-lowcode-cli')
const PKG_CORE = resolve(CWD, './packages/varlet-lowcode-core')

export const buildCli = () => execa('pnpm', ['build'], { cwd: PKG_CLI })

export const buildCore = () => execa('pnpm', ['build'], { cwd: PKG_CORE })


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
