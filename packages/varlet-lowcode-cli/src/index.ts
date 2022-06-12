#!/usr/bin/env node
import logger from './shared/logger'
import { Command } from 'commander'
import { dev } from './commands/dev'
import { build } from './commands/build'
import { compile } from './commands/compile'
import { preview } from './commands/preview'

const program = new Command()

program.version(`varlet-lowcode-cli ${require('../package.json').version}`).usage('<command> [options]')

program
  .command('dev')
  .option('-f --force', 'Force dep pre-optimization regardless of whether deps have changed')
  .description('Run varlet low-code development environment')
  .action(dev)

program.command('build').description('Build varlet low-code playground for production').action(build)

program
  .command('compile')
  .option('-w --watch', 'Compile varlet low-code plugin to library code in watch mode')
  .description('Compile varlet low-code plugin to library code')
  .action(compile)

program.command('preview').description('Preview varlet low-code playground for production').action(preview)

program.on('command:*', ([cmd]) => {
  program.outputHelp()
  logger.error(`\nUnknown command ${cmd}.\n`)
  process.exitCode = 1
})

program.parse()
