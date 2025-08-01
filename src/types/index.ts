import { z } from 'zod';

/**
 * Model types available for Claude agents
 */
export enum ModelType {
  OPUS = 'opus',
  SONNET = 'sonnet',
  HAIKU = 'haiku'
}

/**
 * Agent metadata schema
 */
export const AgentMetadataSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(10).max(500),
  model: z.nativeEnum(ModelType),
  version: z.string().optional().default('1.0.0'),
  author: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  examples: z.array(z.object({
    input: z.string(),
    output: z.string()
  })).optional()
});

export type AgentMetadata = z.infer<typeof AgentMetadataSchema>;

/**
 * Agent configuration including metadata and content
 */
export interface AgentConfig {
  metadata: AgentMetadata;
  content: string;
  path?: string;
}

/**
 * Agent validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error';
}

export interface ValidationWarning {
  field: string;
  message: string;
  severity: 'warning';
}

/**
 * Agent test case
 */
export interface AgentTestCase {
  name: string;
  input: string;
  expectedOutput?: string;
  expectedBehavior?: string[];
  shouldContain?: string[];
  shouldNotContain?: string[];
}

/**
 * Agent test result
 */
export interface AgentTestResult {
  testCase: AgentTestCase;
  passed: boolean;
  output?: string;
  error?: string;
  duration: number;
}

/**
 * CLI command options
 */
export interface CreateAgentOptions {
  name: string;
  description?: string;
  model?: ModelType;
  interactive?: boolean;
  template?: string;
  output?: string;
  examples?: Array<{input: string; output: string}>;
}

export interface ValidateOptions {
  path: string;
  strict?: boolean;
  fix?: boolean;
}

export interface TestOptions {
  path: string;
  testFile?: string;
  verbose?: boolean;
}