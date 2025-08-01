import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

export const initCommand = new Command('init')
  .description('Initialize Claude agents in your project')
  .option('-g, --global', 'Initialize globally in ~/.claude/agents')
  .option('-p, --path <path>', 'Custom path for agents')
  .action(async (options: { global?: boolean; path?: string }) => {
    try {
      console.log(chalk.cyan('🚀 Initializing Claude Agents Framework\n'));

      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'global',
          message: 'Initialize agents globally (in ~/.claude/agents)?',
          default: options.global || false,
          when: !options.path
        },
        {
          type: 'input',
          name: 'customPath',
          message: 'Enter custom path for agents:',
          when: (answers) => !answers.global && !options.path,
          default: './agents'
        }
      ]);

      // Determine the target path
      let targetPath: string;
      if (options.path) {
        targetPath = path.resolve(options.path);
      } else if (options.global || answers.global) {
        targetPath = path.join(os.homedir(), '.claude', 'agents');
      } else {
        targetPath = path.resolve(answers.customPath || './agents');
      }

      const spinner = ora('Creating directory structure...').start();

      // Create directory structure
      await fs.ensureDir(targetPath);
      await fs.ensureDir(path.join(targetPath, 'examples'));
      
      // Create config file
      const configPath = path.join(targetPath, 'config.json');
      const config = {
        version: '1.0.0',
        created: new Date().toISOString(),
        author: process.env.USER || 'unknown',
        settings: {
          defaultModel: 'sonnet',
          validateOnSave: true,
          autoFormat: true
        }
      };
      
      await fs.writeJSON(configPath, config, { spaces: 2 });

      // Create README
      const readmePath = path.join(targetPath, 'README.md');
      const readme = `# Claude Agents

This directory contains specialized AI agents for Claude Code.

## Structure

\`\`\`
agents/
├── config.json       # Configuration file
├── examples/         # Example agents
└── *.md             # Your custom agents
\`\`\`

## Creating Agents

Use the CLI to create new agents:

\`\`\`bash
claude-agents create my-agent
\`\`\`

## Validating Agents

\`\`\`bash
claude-agents validate .
\`\`\`

Created with Claude Agents Framework v${require('../../../package.json').version}
`;

      await fs.writeFile(readmePath, readme);

      // Create example agent
      const examplePath = path.join(targetPath, 'examples', 'example-agent.md');
      const exampleAgent = `---
name: example-agent
description: An example agent showing the structure and capabilities
model: sonnet
version: 1.0.0
tags: [example, demo]
---

You are an example agent demonstrating the Claude Agents Framework.

## Capabilities

- Show users how to structure agent files
- Explain best practices
- Provide helpful examples

## Guidelines

1. Be clear and concise
2. Use examples to illustrate points
3. Follow the framework conventions

## Example Usage

When users ask about creating agents, provide clear examples:

\`\`\`markdown
---
name: my-specialist
description: Specialized in specific domain
model: sonnet
---

You are a specialist in [domain]...
\`\`\`

Remember: Good agents are focused, well-documented, and easy to understand.
`;

      await fs.writeFile(examplePath, exampleAgent);

      spinner.succeed('Directory structure created');

      // Create .gitignore
      const gitignorePath = path.join(targetPath, '.gitignore');
      const gitignore = `# Claude Agents
*.log
*.tmp
.DS_Store
node_modules/
`;
      await fs.writeFile(gitignorePath, gitignore);

      console.log('\n' + chalk.green('✅ Claude Agents initialized successfully!'));
      console.log(chalk.gray(`Location: ${targetPath}`));
      
      console.log('\n' + chalk.cyan('Next steps:'));
      console.log('1. Create your first agent:');
      console.log(chalk.gray(`   claude-agents create my-first-agent`));
      console.log('2. View example agents:');
      console.log(chalk.gray(`   ls ${path.join(targetPath, 'examples')}`));
      console.log('3. Validate your agents:');
      console.log(chalk.gray(`   claude-agents validate ${targetPath}`));

    } catch (error: any) {
      console.error(chalk.red('Initialization failed:'), error.message);
      process.exit(1);
    }
  });