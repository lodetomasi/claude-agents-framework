#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import * as pkg from '../../package.json';
import { createCommand } from './commands/create';
import { validateCommand } from './commands/validate';
import { testCommand } from './commands/test';
import { listCommand } from './commands/list';
import { initCommand } from './commands/init';
import { deployCommand } from './commands/deploy';
import { syncCommand } from './commands/sync';

const program = new Command();

program
  .name('claude-agents')
  .description('CLI for Claude Agents Framework')
  .version(pkg.version);

// Add ASCII art banner
console.log(chalk.cyan(`
╔═══════════════════════════════════════╗
║   Claude Agents Framework v${pkg.version}      ║
║   Build AI specialists for Claude     ║
╚═══════════════════════════════════════╝
`));

// Register commands
program.addCommand(initCommand);
program.addCommand(createCommand);
program.addCommand(validateCommand);
program.addCommand(testCommand);
program.addCommand(listCommand);
program.addCommand(deployCommand);
program.addCommand(syncCommand);

// Error handling
program.exitOverride();

try {
  program.parse(process.argv);
} catch (error: any) {
  if (error.code === 'commander.helpDisplayed') {
    process.exit(0);
  }
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
}