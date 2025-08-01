import { Agent } from './Agent';
import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';

/**
 * Loads agents from filesystem
 */
export class AgentLoader {
  private agentsPath: string;

  constructor(agentsPath?: string) {
    this.agentsPath = agentsPath || this.getDefaultAgentsPath();
  }

  /**
   * Get default agents path
   */
  private getDefaultAgentsPath(): string {
    return path.join(os.homedir(), '.claude', 'agents');
  }

  /**
   * Load all agents from directory
   */
  async loadAll(): Promise<Agent[]> {
    const pattern = path.join(this.agentsPath, '**/*.md');
    const files = await glob.glob(pattern);
    
    const agents: Agent[] = [];
    
    for (const file of files) {
      try {
        const agent = await Agent.fromFile(file);
        agents.push(agent);
      } catch (error) {
        console.error(`Failed to load agent from ${file}:`, error);
      }
    }
    
    return agents;
  }

  /**
   * Load agent by name
   */
  async loadByName(name: string): Promise<Agent | null> {
    const possiblePaths = [
      path.join(this.agentsPath, `${name}.md`),
      path.join(this.agentsPath, name, 'agent.md'),
      path.join(this.agentsPath, name, `${name}.md`)
    ];

    for (const filePath of possiblePaths) {
      if (await fs.pathExists(filePath)) {
        try {
          return await Agent.fromFile(filePath);
        } catch (error) {
          console.error(`Failed to load agent from ${filePath}:`, error);
        }
      }
    }

    return null;
  }

  /**
   * Load agents from custom directory
   */
  async loadFromDirectory(directory: string): Promise<Agent[]> {
    const pattern = path.join(directory, '**/*.md');
    const files = await glob.glob(pattern);
    
    const agents: Agent[] = [];
    
    for (const file of files) {
      try {
        const agent = await Agent.fromFile(file);
        agents.push(agent);
      } catch (error) {
        console.error(`Failed to load agent from ${file}:`, error);
      }
    }
    
    return agents;
  }

  /**
   * Watch for agent changes
   */
  watch(_callback: (event: 'add' | 'change' | 'remove', agent: Agent | string) => void): void {
    // Implementation would use chokidar or similar
    // Simplified for now
    console.log('Watching for agent changes...');
  }

  /**
   * Get agent file path
   */
  getAgentPath(name: string): string {
    return path.join(this.agentsPath, `${name}.md`);
  }

  /**
   * Check if agent exists
   */
  async exists(name: string): Promise<boolean> {
    const agent = await this.loadByName(name);
    return agent !== null;
  }
}