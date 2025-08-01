import { Agent } from '../core/Agent';
import { AgentConfig, CreateAgentOptions, ModelType } from '../types';
import { templates } from './templates';

/**
 * Generates new agents from templates
 */
export class AgentGenerator {
  /**
   * Generate a new agent
   */
  async generate(options: CreateAgentOptions): Promise<Agent> {
    const template = this.getTemplate(options.template || 'general');
    
    const config: AgentConfig = {
      metadata: {
        name: options.name,
        description: options.description || template.defaultDescription,
        model: options.model || ModelType.SONNET,
        version: '1.0.0',
        author: process.env.USER || 'unknown',
        tags: template.tags || []
      },
      content: this.generateContent(options, template)
    };

    return new Agent(config);
  }

  /**
   * Get template by name
   */
  private getTemplate(templateName: string): any {
    return templates[templateName] || templates.general;
  }

  /**
   * Generate agent content based on template
   */
  private generateContent(options: CreateAgentOptions, template: any): string {
    let content = template.content;

    // Replace placeholders
    content = content.replace(/{{name}}/g, options.name);
    content = content.replace(/{{description}}/g, options.description || template.defaultDescription);
    content = content.replace(/{{domain}}/g, template.domain || 'general tasks');

    // Add custom sections based on template type
    if (template.sections) {
      for (const section of template.sections) {
        content += `\n\n## ${section.title}\n\n${section.content}`;
      }
    }

    // Add examples if provided
    if (options.examples && options.examples.length > 0) {
      content += '\n\n## Examples\n';
      for (const example of options.examples) {
        content += `\n### Input:\n${example.input}\n\n### Output:\n${example.output}\n`;
      }
    }

    return content;
  }

  /**
   * List available templates
   */
  listTemplates(): string[] {
    return Object.keys(templates);
  }

  /**
   * Get template info
   */
  getTemplateInfo(templateName: string): {
    name: string;
    description: string;
    tags: string[];
  } {
    const template = templates[templateName];
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    return {
      name: templateName,
      description: template.description,
      tags: template.tags || []
    };
  }
}