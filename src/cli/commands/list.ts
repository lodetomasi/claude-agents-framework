import { Command } from 'commander';
import chalk from 'chalk';
import { AgentManager } from '../../core/AgentManager';
import Table from 'cli-table3';

export const listCommand = new Command('list')
  .description('List all available agents')
  .option('-p, --path <path>', 'Path to agents directory')
  .option('-m, --model <model>', 'Filter by model type')
  .option('-t, --tags <tags>', 'Filter by tags (comma-separated)')
  .option('-s, --search <query>', 'Search agents by name or description')
  .option('--json', 'Output as JSON')
  .action(async (options: any) => {
    try {
      const manager = new AgentManager(options.path);
      await manager.loadAgents();

      let agents = manager.getAllAgents();

      // Apply filters
      if (options.model) {
        agents = agents.filter(a => a.model === options.model);
      }

      if (options.tags) {
        const tags = options.tags.split(',').map((t: string) => t.trim());
        agents = manager.filterByTags(tags);
      }

      if (options.search) {
        agents = manager.searchAgents(options.search);
      }

      if (agents.length === 0) {
        console.log(chalk.yellow('No agents found matching criteria'));
        return;
      }

      if (options.json) {
        // JSON output
        const output = agents.map(agent => ({
          name: agent.name,
          description: agent.description,
          model: agent.model,
          version: agent.metadata.version,
          tags: agent.metadata.tags
        }));
        console.log(JSON.stringify(output, null, 2));
      } else {
        // Table output
        const table = new Table({
          head: ['Name', 'Description', 'Model', 'Tags'],
          colWidths: [25, 50, 10, 20],
          style: {
            head: ['cyan']
          }
        });

        for (const agent of agents) {
          table.push([
            chalk.green(agent.name),
            agent.description.length > 47 
              ? agent.description.substring(0, 47) + '...'
              : agent.description,
            getModelBadge(agent.model),
            (agent.metadata.tags || []).join(', ')
          ]);
        }

        console.log(table.toString());

        // Stats
        const stats = manager.getStats();
        console.log('\n' + chalk.gray('─'.repeat(50)));
        console.log(chalk.cyan('Statistics:'));
        console.log(`  Total agents: ${stats.total}`);
        console.log(`  By model: ${Object.entries(stats.byModel)
          .map(([model, count]) => `${model} (${count})`)
          .join(', ')}`);
      }

    } catch (error: any) {
      console.error(chalk.red('Failed to list agents:'), error.message);
      process.exit(1);
    }
  });

function getModelBadge(model: string): string {
  switch (model) {
    case 'opus':
      return chalk.magenta('opus');
    case 'sonnet':
      return chalk.blue('sonnet');
    case 'haiku':
      return chalk.green('haiku');
    default:
      return chalk.gray(model);
  }
}

// Import cli-table3 types
declare module 'cli-table3' {
  interface TableConstructorOptions {
    head?: string[];
    colWidths?: number[];
    style?: {
      head?: string[];
    };
  }

  class Table {
    constructor(options?: TableConstructorOptions);
    push(row: any[]): void;
    toString(): string;
  }

  export = Table;
}