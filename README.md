# 🤖 Claude Agents Framework

<div align="center">

[![npm version](https://img.shields.io/npm/v/claude-agents-framework.svg)](https://www.npmjs.com/package/claude-agents-framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)

**Build, test, and deploy specialized AI agents for Claude Code**

[Documentation](#documentation) • [Quick Start](#quick-start) • [Examples](#examples) • [API Reference](#api-reference)

</div>

## 🎯 Overview

Claude Agents Framework is a powerful TypeScript SDK and CLI toolkit for creating hyper-specialized AI agents that enhance Claude Code with domain-specific expertise. Build agents that transform Claude into your personal team of experts.

### ✨ Features

- **🛠️ Complete SDK**: Full TypeScript API for programmatic agent management
- **⚡ CLI Tools**: Create, validate, test, and deploy agents from the command line
- **📋 Templates**: Pre-built templates for common agent types
- **✅ Testing Framework**: Validate agent behavior with automated tests
- **🔍 Smart Validation**: Catch errors before deployment
- **📦 Easy Distribution**: Share agents via npm or GitHub

## 🚀 Quick Start

### Installation

```bash
# Global installation (recommended)
npm install -g claude-agents-framework

# Or use with npx
npx claude-agents-framework init
```

### Initialize Your First Project

```bash
# Initialize globally (recommended)
claude-agents init --global

# Or in current directory
claude-agents init
```

### Create Your First Agent

```bash
# Interactive mode
claude-agents create

# Or with parameters
claude-agents create my-expert --description "An expert in my domain" --model sonnet
```

## 📖 Documentation

### CLI Commands

#### `init` - Initialize agents directory

```bash
claude-agents init [options]

Options:
  -g, --global         Initialize globally in ~/.claude/agents
  -p, --path <path>    Custom path for agents
```

#### `create` - Create new agent

```bash
claude-agents create [name] [options]

Options:
  -d, --description    Agent description
  -m, --model         Model type (opus/sonnet/haiku)
  -t, --template      Template to use
  -o, --output        Output directory
  -i, --interactive   Interactive mode
```

#### `validate` - Validate agent files

```bash
claude-agents validate <path> [options]

Options:
  -s, --strict    Enable strict validation
  -f, --fix       Auto-fix common issues
```

#### `test` - Test agents

```bash
claude-agents test <agent> [options]

Options:
  -t, --test-file    Test file path
  -v, --verbose      Verbose output
```

#### `list` - List available agents

```bash
claude-agents list [options]

Options:
  -p, --path         Path to agents directory
  -m, --model        Filter by model type
  -t, --tags         Filter by tags
  -s, --search       Search query
  --json            Output as JSON
```

### 🧩 SDK Usage

```typescript
import { 
  Agent, 
  AgentManager, 
  AgentGenerator,
  AgentValidator 
} from 'claude-agents-framework';

// Create an agent programmatically
const agent = new Agent({
  metadata: {
    name: 'react-expert',
    description: 'Expert in React and modern web development',
    model: 'sonnet',
    tags: ['frontend', 'react', 'javascript']
  },
  content: `You are a React expert...`
});

// Save agent
await agent.save('./agents/react-expert.md');

// Manage multiple agents
const manager = new AgentManager();
await manager.loadAgents();

// Search agents
const frontendAgents = manager.searchAgents('frontend');
const reactExperts = manager.filterByTags(['react']);

// Validate agents
const validator = new AgentValidator();
const result = await validator.validateAgent(agent);
```

### 📝 Agent File Structure

```markdown
---
name: my-expert
description: An expert in specific domain
model: sonnet
version: 1.0.0
tags: [tag1, tag2]
---

You are an expert assistant specialized in...

## Capabilities

- Capability 1
- Capability 2

## Guidelines

1. Guideline 1
2. Guideline 2

## Examples

When asked about X, provide Y...
```

## 🎭 Examples

### Frontend Expert Agent

```bash
claude-agents create react-wizard \
  --description "React and Next.js expert" \
  --model sonnet \
  --template frontend
```

### DevOps Automation Agent

```bash
claude-agents create devops-master \
  --description "Kubernetes and CI/CD specialist" \
  --model opus \
  --template devops
```

### Custom Agent with Testing

```yaml
# tests/security-expert.test.yaml
- name: Security audit request
  input: "Review this authentication code for vulnerabilities"
  shouldContain: 
    - "security"
    - "vulnerability"
    - "recommendation"

- name: Best practices
  input: "What are the best practices for API security?"
  shouldNotContain:
    - "I cannot"
    - "I don't know"
```

```bash
claude-agents test ./agents/security-expert.md -t ./tests/security-expert.test.yaml
```

## 🏗️ Architecture

```
claude-agents-framework/
├── src/
│   ├── core/           # Core classes (Agent, Manager, Validator)
│   ├── cli/            # CLI implementation
│   ├── generators/     # Agent generators and templates
│   ├── testing/        # Testing framework
│   └── utils/          # Utility functions
├── templates/          # Agent templates
└── examples/           # Example agents
```

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/lorenzodetomasi/claude-agents-framework.git
cd claude-agents-framework

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Development mode
npm run dev
```

## 📊 Benchmarks

| Operation | Time | Memory |
|-----------|------|--------|
| Load 100 agents | ~150ms | ~25MB |
| Validate agent | ~5ms | ~2MB |
| Search agents | ~10ms | ~1MB |
| Generate agent | ~20ms | ~5MB |

## 🔮 Roadmap

- [ ] Agent marketplace/registry
- [ ] Visual agent builder
- [ ] Claude API integration
- [ ] Agent versioning system
- [ ] Collaborative agent development
- [ ] Performance analytics
- [ ] Agent composition/chaining

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👨‍💻 Author

Created by **Lorenzo De Tomasi**

---

<div align="center">

**Build smarter with Claude Agents Framework** 🚀

[GitHub](https://github.com/lorenzodetomasi/claude-agents-framework) • [npm](https://www.npmjs.com/package/claude-agents-framework) • [Documentation](https://github.com/lorenzodetomasi/claude-agents-framework/wiki)

</div>