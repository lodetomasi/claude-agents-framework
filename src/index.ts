/**
 * Claude Agents Framework
 * Build, test, and deploy specialized AI agents for Claude Code
 * 
 * @author Lorenzo De Tomasi
 * @license MIT
 */

export { Agent, AgentConfig } from './core/Agent';
export { AgentManager } from './core/AgentManager';
export { AgentLoader } from './core/AgentLoader';
export { AgentValidator } from './core/AgentValidator';
export { AgentGenerator } from './generators/AgentGenerator';
export { AgentTester } from './testing/AgentTester';
export { ClaudeCodeIntegration } from './integrations/ClaudeCodeIntegration';
export * from './types';
export * from './utils';