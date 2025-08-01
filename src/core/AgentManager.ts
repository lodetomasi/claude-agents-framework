import { Agent } from './Agent';
import { AgentLoader } from './AgentLoader';
import { AgentValidator } from './AgentValidator';
import { AgentConfig, ValidationResult } from '../types';
import * as path from 'path';

/**
 * Manages a collection of agents
 */
export class AgentManager {
  private agents: Map<string, Agent> = new Map();
  private loader: AgentLoader;
  private validator: AgentValidator;

  constructor(agentsPath?: string) {
    this.loader = new AgentLoader(agentsPath);
    this.validator = new AgentValidator();
  }

  /**
   * Load all agents from directory
   */
  async loadAgents(): Promise<void> {
    const agents = await this.loader.loadAll();
    
    for (const agent of agents) {
      this.agents.set(agent.name, agent);
    }
  }

  /**
   * Get agent by name
   */
  getAgent(name: string): Agent | undefined {
    return this.agents.get(name);
  }

  /**
   * Get all agents
   */
  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Search agents by query
   */
  searchAgents(query: string): Agent[] {
    const lowerQuery = query.toLowerCase();
    
    return this.getAllAgents().filter(agent => {
      const nameMatch = agent.name.toLowerCase().includes(lowerQuery);
      const descMatch = agent.description.toLowerCase().includes(lowerQuery);
      const tagsMatch = agent.metadata.tags?.some(tag => 
        tag.toLowerCase().includes(lowerQuery)
      );
      
      return nameMatch || descMatch || tagsMatch;
    });
  }

  /**
   * Filter agents by model type
   */
  filterByModel(model: string): Agent[] {
    return this.getAllAgents().filter(agent => agent.model === model);
  }

  /**
   * Filter agents by tags
   */
  filterByTags(tags: string[]): Agent[] {
    return this.getAllAgents().filter(agent => {
      const agentTags = agent.metadata.tags || [];
      return tags.some(tag => agentTags.includes(tag));
    });
  }

  /**
   * Add new agent
   */
  async addAgent(config: AgentConfig): Promise<ValidationResult> {
    const validation = await this.validator.validate(config);
    
    if (validation.valid) {
      const agent = new Agent(config);
      this.agents.set(agent.name, agent);
      
      if (config.path) {
        await agent.save(config.path);
      }
    }
    
    return validation;
  }

  /**
   * Update existing agent
   */
  async updateAgent(name: string, updates: Partial<AgentConfig>): Promise<ValidationResult> {
    const existing = this.getAgent(name);
    
    if (!existing) {
      return {
        valid: false,
        errors: [{
          field: 'name',
          message: `Agent '${name}' not found`,
          severity: 'error'
        }],
        warnings: []
      };
    }

    const updatedConfig: AgentConfig = {
      ...existing['config'],
      ...updates,
      metadata: {
        ...existing.metadata,
        ...(updates.metadata || {})
      }
    };

    const validation = await this.validator.validate(updatedConfig);
    
    if (validation.valid) {
      const updatedAgent = new Agent(updatedConfig);
      this.agents.set(name, updatedAgent);
      
      if (updatedConfig.path) {
        await updatedAgent.save(updatedConfig.path);
      }
    }
    
    return validation;
  }

  /**
   * Remove agent
   */
  removeAgent(name: string): boolean {
    return this.agents.delete(name);
  }

  /**
   * Validate all agents
   */
  async validateAll(): Promise<Map<string, ValidationResult>> {
    const results = new Map<string, ValidationResult>();
    
    for (const agent of this.getAllAgents()) {
      const validation = await this.validator.validateAgent(agent);
      results.set(agent.name, validation);
    }
    
    return results;
  }

  /**
   * Export agents to directory
   */
  async exportAgents(outputDir: string, agents?: string[]): Promise<void> {
    const agentsToExport = agents 
      ? agents.map(name => this.getAgent(name)).filter(Boolean) as Agent[]
      : this.getAllAgents();

    for (const agent of agentsToExport) {
      const filePath = path.join(outputDir, `${agent.name}.md`);
      await agent.save(filePath);
    }
  }

  /**
   * Get statistics about loaded agents
   */
  getStats(): {
    total: number;
    byModel: Record<string, number>;
    byTags: Record<string, number>;
  } {
    const agents = this.getAllAgents();
    const byModel: Record<string, number> = {};
    const byTags: Record<string, number> = {};

    for (const agent of agents) {
      // Count by model
      byModel[agent.model] = (byModel[agent.model] || 0) + 1;

      // Count by tags
      for (const tag of (agent.metadata.tags || [])) {
        byTags[tag] = (byTags[tag] || 0) + 1;
      }
    }

    return {
      total: agents.length,
      byModel,
      byTags
    };
  }
}