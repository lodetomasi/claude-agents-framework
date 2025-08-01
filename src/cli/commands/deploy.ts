import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { AgentManager } from '../../core/AgentManager';
import { ClaudeCodeIntegration } from '../../integrations/ClaudeCodeIntegration';
import { Agent } from '../../core/Agent';

export const deployCommand = new Command('deploy')
  .description('Deploy agents to Claude Code')
  .argument('[agents...]', 'Specific agents to deploy (deploys all if not specified)')
  .option('-p, --path <path>', 'Path to agents directory')
  .option('-s, --status', 'Show Claude Code integration status')
  .action(async (agentNames: string[], options: any) => {
    try {
      const integration = new ClaudeCodeIntegration();

      // Show status if requested
      if (options.status) {
        const status = await integration.getStatus();
        
        console.log(chalk.cyan('\nClaude Code Integration Status:\n'));
        console.log(`Installed: ${status.installed ? chalk.green('✓ Yes') : chalk.red('✗ No')}`);
        console.log(`Config exists: ${status.configExists ? chalk.green('✓ Yes') : chalk.red('✗ No')}`);
        console.log(`Agents path: ${chalk.gray(status.agentsPath)}`);
        
        if (status.deployedAgents.length > 0) {
          console.log(`\nDeployed agents (${status.deployedAgents.length}):`);
          status.deployedAgents.forEach(agent => {
            console.log(chalk.green(`  • ${agent}`));
          });
        } else {
          console.log(chalk.yellow('\nNo agents deployed yet'));
        }
        return;
      }

      // Check if Claude Code is installed
      const isInstalled = await integration.isClaudeCodeInstalled();
      if (!isInstalled) {
        console.log(chalk.yellow('⚠️  Claude Code directory not found at ~/.claude'));
        console.log(chalk.gray('Creating directory structure...'));
        // Continue anyway - we'll create the structure
      }

      const spinner = ora('Loading agents...').start();

      // Load agents
      const manager = new AgentManager(options.path);
      await manager.loadAgents();

      let agentsToDeploy: Agent[];

      if (agentNames.length > 0) {
        // Deploy specific agents
        agentsToDeploy = agentNames
          .map(name => manager.getAgent(name))
          .filter((agent): agent is Agent => {
            if (!agent) {
              spinner.warn(`Agent '${agent}' not found`);
              return false;
            }
            return true;
          });
      } else {
        // Deploy all agents
        agentsToDeploy = manager.getAllAgents();
      }

      if (agentsToDeploy.length === 0) {
        spinner.fail('No agents to deploy');
        return;
      }

      spinner.text = `Deploying ${agentsToDeploy.length} agent(s)...`;

      // Deploy agents
      await integration.deployAgents(agentsToDeploy);

      spinner.succeed(chalk.green(`Successfully deployed ${agentsToDeploy.length} agent(s) to Claude Code!`));

      console.log(chalk.cyan('\n📍 Agents deployed to:'), chalk.gray('~/.claude/agents/'));
      console.log(chalk.cyan('🔄 Restart Claude Code to load the new agents'));
      
      // Show deployed agents
      console.log(chalk.cyan('\nDeployed agents:'));
      agentsToDeploy.forEach(agent => {
        console.log(`  ${chalk.green('•')} ${agent.name} (${agent.model})`);
      });

    } catch (error: any) {
      console.error(chalk.red('Deployment failed:'), error.message);
      process.exit(1);
    }
  });