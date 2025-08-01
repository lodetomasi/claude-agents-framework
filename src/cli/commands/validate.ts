import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import * as glob from 'glob';
import { Agent } from '../../core/Agent';
import { AgentValidator } from '../../core/AgentValidator';
import { ValidateOptions } from '../../types';

export const validateCommand = new Command('validate')
  .description('Validate agent files')
  .argument('<path>', 'Path to agent file or directory')
  .option('-s, --strict', 'Enable strict validation', false)
  .option('-f, --fix', 'Auto-fix common issues', false)
  .action(async (pathArg: string, options: ValidateOptions) => {
    try {
      const validator = new AgentValidator();
      const files = await findAgentFiles(pathArg);

      if (files.length === 0) {
        console.error(chalk.red('No agent files found'));
        process.exit(1);
      }

      console.log(chalk.cyan(`Validating ${files.length} agent(s)...\n`));

      let hasErrors = false;
      let totalErrors = 0;
      let totalWarnings = 0;

      for (const file of files) {
        const spinner = ora(`Validating ${file}`).start();

        try {
          let agent = await Agent.fromFile(file);
          
          if (options.fix) {
            const fixed = await validator.autoFix({
              metadata: agent.metadata,
              content: agent.content
            });
            agent = new Agent(fixed);
            await agent.save(file);
          }

          const result = await validator.validateAgent(agent);

          if (result.valid && result.warnings.length === 0) {
            spinner.succeed(chalk.green(`✓ ${file}`));
          } else if (result.valid) {
            spinner.warn(chalk.yellow(`⚠ ${file} (${result.warnings.length} warnings)`));
            totalWarnings += result.warnings.length;
            
            if (options.strict) {
              hasErrors = true;
            }
            
            // Show warnings
            for (const warning of result.warnings) {
              console.log(chalk.yellow(`  └─ ${warning.field}: ${warning.message}`));
            }
          } else {
            spinner.fail(chalk.red(`✗ ${file} (${result.errors.length} errors)`));
            hasErrors = true;
            totalErrors += result.errors.length;
            
            // Show errors
            for (const error of result.errors) {
              console.log(chalk.red(`  └─ ${error.field}: ${error.message}`));
            }
            
            // Show warnings if any
            for (const warning of result.warnings) {
              console.log(chalk.yellow(`  └─ ${warning.field}: ${warning.message}`));
            }
            totalWarnings += result.warnings.length;
          }
        } catch (error: any) {
          spinner.fail(chalk.red(`✗ ${file}`));
          console.log(chalk.red(`  └─ ${error.message}`));
          hasErrors = true;
          totalErrors++;
        }
      }

      // Summary
      console.log('\n' + chalk.gray('─'.repeat(50)));
      console.log(chalk.cyan('Validation Summary:'));
      console.log(`  Files validated: ${files.length}`);
      
      if (totalErrors > 0) {
        console.log(chalk.red(`  Errors: ${totalErrors}`));
      }
      
      if (totalWarnings > 0) {
        console.log(chalk.yellow(`  Warnings: ${totalWarnings}`));
      }
      
      if (!hasErrors && totalWarnings === 0) {
        console.log(chalk.green('  All agents are valid! ✨'));
      }

      if (hasErrors) {
        process.exit(1);
      }
    } catch (error: any) {
      console.error(chalk.red('Validation failed:'), error.message);
      process.exit(1);
    }
  });

async function findAgentFiles(pathArg: string): Promise<string[]> {
  // Check if it's a directory or file
  if (pathArg.endsWith('.md')) {
    return [pathArg];
  }
  
  // Find all .md files in directory
  const pattern = pathArg.endsWith('/') ? `${pathArg}*.md` : `${pathArg}/**/*.md`;
  return glob.glob(pattern);
}