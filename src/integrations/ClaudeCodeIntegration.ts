import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { Agent } from '../core/Agent';
import { AgentManager } from '../core/AgentManager';
import chalk from 'chalk';

/**
 * Integration with Claude Code
 */
export class ClaudeCodeIntegration {
  private claudeAgentsPath: string;
  private claudeConfigPath: string;

  constructor() {
    this.claudeAgentsPath = path.join(os.homedir(), '.claude', 'agents');
    this.claudeConfigPath = path.join(os.homedir(), '.claude', 'config.json');
  }

  /**
   * Check if Claude Code is installed
   */
  async isClaudeCodeInstalled(): Promise<boolean> {
    try {
      const claudeDir = path.join(os.homedir(), '.claude');
      return await fs.pathExists(claudeDir);
    } catch {
      return false;
    }
  }

  /**
   * Deploy agents to Claude Code
   */
  async deployAgents(agents: Agent[]): Promise<void> {
    // Ensure Claude agents directory exists
    await fs.ensureDir(this.claudeAgentsPath);

    console.log(chalk.cyan('🚀 Deploying agents to Claude Code...\n'));

    for (const agent of agents) {
      const targetPath = path.join(this.claudeAgentsPath, `${agent.name}.md`);
      await agent.save(targetPath);
      console.log(chalk.green(`✓ Deployed: ${agent.name}`));
    }

    // Update Claude config if needed
    await this.updateClaudeConfig(agents);
  }

  /**
   * Deploy single agent
   */
  async deployAgent(agent: Agent): Promise<void> {
    await fs.ensureDir(this.claudeAgentsPath);
    const targetPath = path.join(this.claudeAgentsPath, `${agent.name}.md`);
    await agent.save(targetPath);
    console.log(chalk.green(`✓ Deployed ${agent.name} to Claude Code`));
  }

  /**
   * Sync all agents with Claude Code
   */
  async syncWithClaude(manager: AgentManager): Promise<void> {
    const agents = manager.getAllAgents();
    await this.deployAgents(agents);
    
    console.log(chalk.cyan(`\n✨ Synced ${agents.length} agents with Claude Code`));
    console.log(chalk.gray('Restart Claude Code to load the new agents'));
  }

  /**
   * Update Claude config to recognize agents
   */
  private async updateClaudeConfig(agents: Agent[]): Promise<void> {
    let config: any = {};

    // Try to read existing config
    if (await fs.pathExists(this.claudeConfigPath)) {
      try {
        config = await fs.readJSON(this.claudeConfigPath);
      } catch {
        // Invalid config, start fresh
      }
    }

    // Update agents section
    config.agents = config.agents || {};
    config.agents.enabled = true;
    config.agents.path = this.claudeAgentsPath;
    config.agents.loaded = agents.map(a => ({
      name: a.name,
      model: a.model,
      description: a.description
    }));
    config.agents.lastSync = new Date().toISOString();

    // Save updated config
    await fs.writeJSON(this.claudeConfigPath, config, { spaces: 2 });
  }

  /**
   * List agents currently in Claude Code
   */
  async listDeployedAgents(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.claudeAgentsPath);
      return files
        .filter(f => f.endsWith('.md'))
        .map(f => f.replace('.md', ''));
    } catch {
      return [];
    }
  }

  /**
   * Remove agent from Claude Code
   */
  async removeAgent(agentName: string): Promise<void> {
    const agentPath = path.join(this.claudeAgentsPath, `${agentName}.md`);
    if (await fs.pathExists(agentPath)) {
      await fs.remove(agentPath);
      console.log(chalk.yellow(`✓ Removed ${agentName} from Claude Code`));
    }
  }

  /**
   * Get Claude Code status
   */
  async getStatus(): Promise<{
    installed: boolean;
    agentsPath: string;
    deployedAgents: string[];
    configExists: boolean;
  }> {
    const installed = await this.isClaudeCodeInstalled();
    const deployedAgents = await this.listDeployedAgents();
    const configExists = await fs.pathExists(this.claudeConfigPath);

    return {
      installed,
      agentsPath: this.claudeAgentsPath,
      deployedAgents,
      configExists
    };
  }
}