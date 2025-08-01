import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { ClaudeCodeIntegration } from '../../integrations/ClaudeCodeIntegration';
import { AgentManager } from '../../core/AgentManager';

export const syncCommand = new Command('sync')
  .description('Sync agents with Claude Code')
  .option('-p, --path <path>', 'Path to agents directory', '~/.claude/agents')
  .option('--pull', 'Pull agents from Claude Code to local')
  .option('--push', 'Push local agents to Claude Code (default)')
  .action(async (options: any) => {
    try {
      const integration = new ClaudeCodeIntegration();
      const spinner = ora('Checking Claude Code integration...').start();

      // Check status
      const status = await integration.getStatus();
      
      if (!status.installed) {
        spinner.warn('Claude Code directory not found, creating...');
      }

      if (options.pull) {
        // Pull from Claude Code
        spinner.text = 'Pulling agents from Claude Code...';
        
        console.log(chalk.yellow('\n⚠️  Pull functionality coming soon'));
        console.log(chalk.gray('For now, use: cp ~/.claude/agents/*.md <your-path>'));
        spinner.stop();
      } else {
        // Push to Claude Code (default)
        spinner.text = 'Loading local agents...';
        
        const manager = new AgentManager(options.path);
        await manager.loadAgents();
        
        spinner.text = 'Syncing with Claude Code...';
        await integration.syncWithClaude(manager);
        
        spinner.succeed('Sync completed!');
        
        // Show summary
        const agents = manager.getAllAgents();
        console.log(chalk.cyan(`\n📊 Sync Summary:`));
        console.log(`  • Total agents: ${agents.length}`);
        console.log(`  • Location: ~/.claude/agents/`);
        
        // Group by model
        const byModel = agents.reduce((acc, agent) => {
          acc[agent.model] = (acc[agent.model] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        console.log(chalk.cyan(`\n📈 By Model:`));
        Object.entries(byModel).forEach(([model, count]) => {
          console.log(`  • ${model}: ${count}`);
        });
      }

    } catch (error: any) {
      console.error(chalk.red('Sync failed:'), error.message);
      process.exit(1);
    }
  });