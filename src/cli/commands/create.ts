import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import * as path from 'path';
import { AgentGenerator } from '../../generators/AgentGenerator';
import { ModelType, CreateAgentOptions } from '../../types';

export const createCommand = new Command('create')
  .description('Create a new agent')
  .argument('[name]', 'Agent name')
  .option('-d, --description <description>', 'Agent description')
  .option('-m, --model <model>', 'Model type (opus, sonnet, haiku)', 'sonnet')
  .option('-t, --template <template>', 'Template to use')
  .option('-o, --output <path>', 'Output directory')
  .option('-i, --interactive', 'Interactive mode', false)
  .action(async (name?: string, options?: CreateAgentOptions) => {
    try {
      let config: CreateAgentOptions;

      if (options?.interactive || !name) {
        // Interactive mode
        config = await promptAgentDetails(name);
      } else {
        config = {
          name,
          description: options?.description,
          model: options?.model as ModelType,
          template: options?.template,
          output: options?.output
        };
      }

      const spinner = ora('Creating agent...').start();

      const generator = new AgentGenerator();
      const agent = await generator.generate(config);
      
      const outputPath = config.output || process.cwd();
      const agentPath = path.join(outputPath, `${config.name}.md`);
      
      await agent.save(agentPath);

      spinner.succeed(chalk.green(`Agent '${config.name}' created successfully!`));
      console.log(chalk.gray(`Location: ${agentPath}`));
      
      // Show preview
      console.log('\n' + chalk.cyan('Agent Preview:'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(agent.toMarkdown().slice(0, 200) + '...');
      
    } catch (error: any) {
      console.error(chalk.red('Failed to create agent:'), error.message);
      process.exit(1);
    }
  });

async function promptAgentDetails(providedName?: string): Promise<CreateAgentOptions> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Agent name:',
      default: providedName,
      validate: (input: string) => {
        if (!input) return 'Name is required';
        if (!/^[a-z0-9-]+$/.test(input)) {
          return 'Name must contain only lowercase letters, numbers, and hyphens';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Agent description:',
      validate: (input: string) => {
        if (!input) return 'Description is required';
        if (input.length < 10) return 'Description must be at least 10 characters';
        return true;
      }
    },
    {
      type: 'list',
      name: 'model',
      message: 'Select model type:',
      choices: [
        { name: 'Sonnet (balanced performance)', value: ModelType.SONNET },
        { name: 'Opus (complex tasks)', value: ModelType.OPUS },
        { name: 'Haiku (quick responses)', value: ModelType.HAIKU }
      ],
      default: ModelType.SONNET
    },
    {
      type: 'list',
      name: 'template',
      message: 'Select template:',
      choices: [
        { name: 'General Purpose', value: 'general' },
        { name: 'Frontend Specialist', value: 'frontend' },
        { name: 'Backend Expert', value: 'backend' },
        { name: 'DevOps Master', value: 'devops' },
        { name: 'Data Scientist', value: 'data' },
        { name: 'Security Analyst', value: 'security' },
        { name: 'Custom (blank)', value: 'custom' }
      ]
    },
    {
      type: 'confirm',
      name: 'addExamples',
      message: 'Add example interactions?',
      default: true
    }
  ]);

  if (answers.addExamples) {
    const examples = await promptExamples();
    answers.examples = examples;
  }

  return answers;
}

async function promptExamples(): Promise<Array<{input: string; output: string}>> {
  const examples = [];
  let addMore = true;

  while (addMore) {
    const example = await inquirer.prompt([
      {
        type: 'input',
        name: 'input',
        message: 'Example input:'
      },
      {
        type: 'input',
        name: 'output',
        message: 'Expected output:'
      }
    ]);

    examples.push(example);

    const { continue: cont } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: 'Add another example?',
        default: false
      }
    ]);

    addMore = cont;
  }

  return examples;
}