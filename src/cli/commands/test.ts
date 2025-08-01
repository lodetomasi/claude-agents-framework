import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { Agent } from '../../core/Agent';
import { AgentTester } from '../../testing/AgentTester';
import { TestOptions } from '../../types';

export const testCommand = new Command('test')
  .description('Test agent with predefined test cases')
  .argument('<agent>', 'Agent file path')
  .option('-t, --test-file <file>', 'Test file path')
  .option('-v, --verbose', 'Verbose output', false)
  .action(async (agentPath: string, options: TestOptions) => {
    try {
      const spinner = ora('Loading agent...').start();
      
      const agent = await Agent.fromFile(agentPath);
      spinner.succeed(`Loaded agent: ${agent.name}`);

      const tester = new AgentTester();
      
      // Load test cases
      let testCases;
      if (options.testFile) {
        testCases = await tester.loadTestFile(options.testFile);
      } else {
        testCases = await tester.generateDefaultTests(agent);
      }

      if (testCases.length === 0) {
        console.log(chalk.yellow('No test cases found'));
        return;
      }

      console.log(chalk.cyan(`\nRunning ${testCases.length} test(s)...\n`));

      // Run tests
      const results = await tester.runTests(agent, testCases, {
        verbose: options.verbose
      });

      // Display results
      let passed = 0;
      let failed = 0;

      for (const result of results) {
        if (result.passed) {
          console.log(chalk.green(`✓ ${result.testCase.name}`));
          passed++;
          
          if (options.verbose && result.output) {
            console.log(chalk.gray(`  Output: ${result.output.substring(0, 100)}...`));
          }
        } else {
          console.log(chalk.red(`✗ ${result.testCase.name}`));
          failed++;
          
          if (result.error) {
            console.log(chalk.red(`  Error: ${result.error}`));
          }
          
          if (options.verbose && result.output) {
            console.log(chalk.gray(`  Output: ${result.output}`));
          }
        }
        
        console.log(chalk.gray(`  Duration: ${result.duration}ms`));
      }

      // Summary
      console.log('\n' + chalk.gray('─'.repeat(50)));
      console.log(chalk.cyan('Test Summary:'));
      console.log(`  Total: ${results.length}`);
      console.log(chalk.green(`  Passed: ${passed}`));
      
      if (failed > 0) {
        console.log(chalk.red(`  Failed: ${failed}`));
      }

      const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
      console.log(`  Average duration: ${avgDuration.toFixed(2)}ms`);

      if (failed > 0) {
        process.exit(1);
      } else {
        console.log('\n' + chalk.green('All tests passed! ✨'));
      }

    } catch (error: any) {
      console.error(chalk.red('Test execution failed:'), error.message);
      process.exit(1);
    }
  });