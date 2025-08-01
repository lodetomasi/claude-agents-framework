import { AgentConfig, AgentMetadata } from '../types';
import * as yaml from 'yaml';
import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Core Agent class representing a Claude agent
 */
export class Agent {
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  /**
   * Get agent metadata
   */
  get metadata(): AgentMetadata {
    return this.config.metadata;
  }

  /**
   * Get agent content/instructions
   */
  get content(): string {
    return this.config.content;
  }

  /**
   * Get agent name
   */
  get name(): string {
    return this.metadata.name;
  }

  /**
   * Get agent description
   */
  get description(): string {
    return this.metadata.description;
  }

  /**
   * Get agent model type
   */
  get model(): string {
    return this.metadata.model;
  }

  /**
   * Load agent from file
   */
  static async fromFile(filePath: string): Promise<Agent> {
    const content = await fs.readFile(filePath, 'utf-8');
    const config = this.parseAgentFile(content);
    config.path = filePath;
    return new Agent(config);
  }

  /**
   * Parse agent file content
   */
  private static parseAgentFile(content: string): AgentConfig {
    const parts = content.split('---').filter(Boolean);
    
    if (parts.length < 2) {
      throw new Error('Invalid agent file format: missing frontmatter');
    }

    const metadata = yaml.parse(parts[0]!) as AgentMetadata;
    const agentContent = parts.slice(1).join('---').trim();

    return {
      metadata,
      content: agentContent
    };
  }

  /**
   * Save agent to file
   */
  async save(filePath: string): Promise<void> {
    const dir = path.dirname(filePath);
    await fs.ensureDir(dir);

    const frontmatter = yaml.stringify(this.metadata);
    const content = `---\n${frontmatter}---\n\n${this.content}`;
    
    await fs.writeFile(filePath, content, 'utf-8');
  }

  /**
   * Export agent as markdown
   */
  toMarkdown(): string {
    const frontmatter = yaml.stringify(this.metadata);
    return `---\n${frontmatter}---\n\n${this.content}`;
  }

  /**
   * Clone agent with modifications
   */
  clone(modifications: Partial<AgentConfig>): Agent {
    return new Agent({
      ...this.config,
      ...modifications,
      metadata: {
        ...this.config.metadata,
        ...(modifications.metadata || {})
      }
    });
  }
}

export { AgentConfig };