import { Agent } from '../core/Agent';
import { AgentTestCase, AgentTestResult } from '../types';
import * as fs from 'fs-extra';
import * as yaml from 'yaml';

/**
 * Tests agents with predefined test cases
 */
export class AgentTester {
  /**
   * Run tests for an agent
   */
  async runTests(
    agent: Agent, 
    testCases: AgentTestCase[], 
    options: { verbose?: boolean } = {}
  ): Promise<AgentTestResult[]> {
    const results: AgentTestResult[] = [];

    for (const testCase of testCases) {
      const startTime = Date.now();
      
      try {
        const result = await this.runSingleTest(agent, testCase);
        results.push({
          ...result,
          duration: Date.now() - startTime
        });

        if (options.verbose) {
          console.log(`Test "${testCase.name}": ${result.passed ? 'PASSED' : 'FAILED'}`);
        }
      } catch (error: any) {
        results.push({
          testCase,
          passed: false,
          error: error.message,
          duration: Date.now() - startTime
        });
      }
    }

    return results;
  }

  /**
   * Run a single test case
   */
  private async runSingleTest(agent: Agent, testCase: AgentTestCase): Promise<AgentTestResult> {
    // Simulate agent interaction
    // In a real implementation, this would interact with Claude API
    const simulatedOutput = this.simulateAgentResponse(agent, testCase.input);

    // Check expectations
    let passed = true;
    let error: string | undefined;

    if (testCase.expectedOutput) {
      passed = simulatedOutput === testCase.expectedOutput;
      if (!passed) {
        error = `Expected output "${testCase.expectedOutput}" but got "${simulatedOutput}"`;
      }
    }

    if (testCase.shouldContain && passed) {
      for (const substring of testCase.shouldContain) {
        if (!simulatedOutput.includes(substring)) {
          passed = false;
          error = `Output should contain "${substring}"`;
          break;
        }
      }
    }

    if (testCase.shouldNotContain && passed) {
      for (const substring of testCase.shouldNotContain) {
        if (simulatedOutput.includes(substring)) {
          passed = false;
          error = `Output should not contain "${substring}"`;
          break;
        }
      }
    }

    return {
      testCase,
      passed,
      output: simulatedOutput,
      error,
      duration: 0 // Will be set by caller
    };
  }

  /**
   * Simulate agent response (placeholder for actual API interaction)
   */
  private simulateAgentResponse(agent: Agent, input: string): string {
    // This is a simple simulation
    // In production, this would call the Claude API with the agent's instructions
    
    const responses: Record<string, string> = {
      'hello': `Hello! I'm ${agent.name}, ${agent.description}`,
      'help': `I can help you with: ${agent.description}`,
      'test': 'This is a test response'
    };

    const lowerInput = input.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
      if (lowerInput.includes(key)) {
        return response;
      }
    }

    return `As ${agent.name}, I understand you're asking about "${input}". ${agent.description}`;
  }

  /**
   * Load test cases from file
   */
  async loadTestFile(filePath: string): Promise<AgentTestCase[]> {
    const content = await fs.readFile(filePath, 'utf-8');
    
    if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
      return yaml.parse(content) as AgentTestCase[];
    } else if (filePath.endsWith('.json')) {
      return JSON.parse(content) as AgentTestCase[];
    } else {
      throw new Error('Test file must be YAML or JSON');
    }
  }

  /**
   * Generate default test cases for an agent
   */
  async generateDefaultTests(agent: Agent): Promise<AgentTestCase[]> {
    const tests: AgentTestCase[] = [
      {
        name: 'Basic greeting',
        input: 'Hello',
        shouldContain: [agent.name]
      },
      {
        name: 'Help request',
        input: 'What can you help me with?',
        shouldContain: [agent.description.substring(0, 20)]
      },
      {
        name: 'Capability check',
        input: `Can you help with ${agent.metadata.tags?.[0] || 'tasks'}?`,
        shouldNotContain: ['cannot', 'unable', "don't"]
      }
    ];

    // Add example-based tests if available
    if (agent.metadata.examples) {
      for (const [index, example] of agent.metadata.examples.entries()) {
        tests.push({
          name: `Example ${index + 1}`,
          input: example.input,
          expectedOutput: example.output
        });
      }
    }

    return tests;
  }

  /**
   * Create test file template
   */
  async createTestTemplate(agentName: string, outputPath: string): Promise<void> {
    const template: AgentTestCase[] = [
      {
        name: 'Test case 1',
        input: 'Your input here',
        expectedOutput: 'Expected output'
      },
      {
        name: 'Test case 2',
        input: 'Another input',
        shouldContain: ['keyword1', 'keyword2']
      },
      {
        name: 'Test case 3',
        input: 'Edge case input',
        shouldNotContain: ['error', 'fail']
      }
    ];

    const content = yaml.stringify(template);
    await fs.writeFile(outputPath, content, 'utf-8');
  }
}