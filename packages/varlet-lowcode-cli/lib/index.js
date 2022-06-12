#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./shared/logger"));
const commander_1 = require("commander");
const dev_1 = require("./commands/dev");
const build_1 = require("./commands/build");
const compile_1 = require("./commands/compile");
const preview_1 = require("./commands/preview");
const program = new commander_1.Command();
program.version(`varlet-lowcode-cli ${require('../package.json').version}`).usage('<command> [options]');
program
    .command('dev')
    .option('-f --force', 'Force dep pre-optimization regardless of whether deps have changed')
    .description('Run varlet low-code development environment')
    .action(dev_1.dev);
program.command('build').description('Build varlet low-code playground for production').action(build_1.build);
program
    .command('compile')
    .option('-w --watch', 'Compile varlet low-code plugin to library code in watch mode')
    .description('Compile varlet low-code plugin to library code')
    .action(compile_1.compile);
program.command('preview').description('Preview varlet low-code playground for production').action(preview_1.preview);
program.on('command:*', ([cmd]) => {
    program.outputHelp();
    logger_1.default.error(`\nUnknown command ${cmd}.\n`);
    process.exitCode = 1;
});
program.parse();
