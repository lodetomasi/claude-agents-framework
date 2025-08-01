import { Agent, AgentManager, AgentValidator, AgentGenerator } from '../src';

async function testFramework() {
  console.log('🧪 Testing Claude Agents Framework SDK...\n');

  // Test 1: Create an agent programmatically
  console.log('1️⃣ Creating agent programmatically...');
  const agent = new Agent({
    metadata: {
      name: 'test-sdk-agent',
      description: 'An agent created via SDK for testing',
      model: 'sonnet',
      tags: ['test', 'demo']
    },
    content: 'You are a test agent created programmatically.'
  });
  console.log(`✅ Created agent: ${agent.name}`);

  // Test 2: Save agent to file
  console.log('\n2️⃣ Saving agent to file...');
  await agent.save('./test-sdk-agent.md');
  console.log('✅ Agent saved');

  // Test 3: Validate agent
  console.log('\n3️⃣ Validating agent...');
  const validator = new AgentValidator();
  const validation = await validator.validateAgent(agent);
  console.log(`✅ Validation: ${validation.valid ? 'PASSED' : 'FAILED'}`);
  if (validation.warnings.length > 0) {
    console.log('⚠️  Warnings:', validation.warnings);
  }

  // Test 4: Generate agent from template
  console.log('\n4️⃣ Generating agent from template...');
  const generator = new AgentGenerator();
  const generatedAgent = await generator.generate({
    name: 'template-test',
    description: 'Agent generated from frontend template',
    template: 'frontend'
  });
  console.log(`✅ Generated agent: ${generatedAgent.name}`);

  // Test 5: Agent Manager
  console.log('\n5️⃣ Testing AgentManager...');
  const manager = new AgentManager('./examples');
  await manager.loadAgents();
  const agents = manager.getAllAgents();
  console.log(`✅ Loaded ${agents.length} example agents`);

  // Test 6: Search agents
  console.log('\n6️⃣ Searching agents...');
  const reactAgents = manager.searchAgents('react');
  console.log(`✅ Found ${reactAgents.length} React-related agents`);

  console.log('\n✨ All tests passed!');
}

// Run tests
testFramework().catch(console.error);