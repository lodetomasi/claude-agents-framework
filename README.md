# 🤖 Claude Agents Framework

<div align="center">

[![npm version](https://img.shields.io/npm/v/claude-agents-framework.svg)](https://www.npmjs.com/package/claude-agents-framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Compatible-purple.svg)](https://claude.ai)

**Build, deploy, and manage specialized AI agents that supercharge Claude Code**

[Quick Start](#-quick-start) • [Features](#-features) • [Documentation](#-documentation) • [Examples](#-examples)

</div>

## 🎯 What is Claude Agents Framework?

Transform Claude Code into a team of specialized AI experts. Create agents for React, Python, AWS, security, or any domain - then deploy them directly to Claude Code with a single command.

```bash
# Create an agent
claude-agents create react-expert --model sonnet

# Deploy to Claude Code
claude-agents deploy react-expert

# Now Claude uses your expert automatically!
```

### ✨ Key Features

- **🚀 Direct Claude Code Integration**: Deploy agents directly to `~/.claude/agents/`
- **🛠️ Powerful CLI**: Create, validate, test, and deploy agents effortlessly
- **🔄 Auto-sync**: Keep your agents synchronized with Claude Code
- **📋 Smart Templates**: Pre-built templates for common specializations
- **✅ Validation**: Ensure agents work perfectly before deployment
- **🎨 Full Customization**: Create any type of specialist you need

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Claude Code installed

### Installation

```bash
# Clone the repository
git clone https://github.com/lorenzodetomasi/claude-agents-framework.git
cd claude-agents-framework

# Install dependencies
npm install

# Build the framework
npm run build

# Create CLI alias (add to ~/.bashrc or ~/.zshrc)
alias claude-agents="node $(pwd)/dist/cli/index.js"
```

### 1️⃣ Initialize Claude Agents

```bash
# Initialize in Claude's directory
claude-agents init --path ~/.claude/agents
```

### 2️⃣ Create Your First Agent

```bash
# Create a React expert
claude-agents create react-expert \
  --description "Expert in React, Next.js, and modern frontend" \
  --model sonnet \
  --template frontend

# Create a Python data scientist
claude-agents create python-data \
  --description "Analyzes data and builds ML models with Python" \
  --model sonnet \
  --template data
```

### 3️⃣ Deploy to Claude Code

```bash
# Deploy all agents
claude-agents deploy

# Or deploy specific agent
claude-agents deploy react-expert

# Check deployment status
claude-agents deploy --status
```

### 4️⃣ Use in Claude Code

```bash
# Start Claude Code
claude code

# Your agents are now active!
# Example: "Help me optimize this React component"
# Claude will automatically use react-expert
```

## 🎭 How It Works

### The Magic Behind Claude Agents

1. **You Create**: Build specialized agents with specific expertise
2. **Framework Validates**: Ensures your agents are properly formatted
3. **Deploy to Claude**: One command sends agents to `~/.claude/agents/`
4. **Claude Loads**: Claude Code automatically loads your agents
5. **Automatic Activation**: Claude uses the right expert based on context

```
You → Create Agent → Deploy → ~/.claude/agents/ → Claude Code → 🎯 Expert Response
```

## 📖 Core Commands

### 🚀 `deploy` - Deploy agents to Claude Code

```bash
# Deploy all agents
claude-agents deploy

# Deploy specific agents
claude-agents deploy react-expert python-data

# Check deployment status
claude-agents deploy --status
```

### 🔄 `sync` - Sync with Claude Code

```bash
# Push all local agents to Claude
claude-agents sync

# Pull agents from Claude (coming soon)
claude-agents sync --pull
```

### ✨ `create` - Create new agent

```bash
# Interactive creation
claude-agents create --interactive

# Quick creation with options
claude-agents create my-expert \
  --description "Expert in specific domain" \
  --model sonnet \
  --template backend
```

### ✅ `validate` - Validate agents

```bash
# Validate all agents
claude-agents validate ~/.claude/agents

# Auto-fix common issues
claude-agents validate ~/.claude/agents --fix
```

### 📋 `list` - List agents

```bash
# List all agents
claude-agents list

# Filter by model
claude-agents list --model opus

# Search agents
claude-agents list --search "react"
```

## 🎨 Agent Templates

Choose from pre-built templates optimized for different domains:

- **`general`** - All-purpose agent template
- **`frontend`** - React, Vue, UI/UX specialists  
- **`backend`** - API, server, database experts
- **`devops`** - Cloud, CI/CD, infrastructure masters
- **`data`** - Data science, ML, analytics pros
- **`security`** - Security, compliance, pen-testing experts

## 🛠️ Real-World Examples

### Example 1: Full-Stack Development Team

```bash
# Frontend expert
claude-agents create react-ui-expert \
  --description "Builds beautiful, accessible React interfaces" \
  --model sonnet --template frontend

# Backend API expert  
claude-agents create api-architect \
  --description "Designs scalable REST and GraphQL APIs" \
  --model sonnet --template backend

# Database specialist
claude-agents create database-wizard \
  --description "Optimizes PostgreSQL and MongoDB queries" \
  --model sonnet --template data

# Deploy the whole team
claude-agents deploy

# Now in Claude Code:
# "Build a full-stack app with user authentication"
# Claude coordinates all three experts automatically!
```

### Example 2: DevOps & Security Pipeline

```bash
# Create DevOps expert
claude-agents create devops-ninja \
  --description "Automates CI/CD with GitHub Actions and Docker" \
  --model opus --template devops

# Create security analyst
claude-agents create security-guardian \
  --description "Identifies vulnerabilities and hardens systems" \
  --model opus --template security

# Deploy and use
claude-agents deploy
claude code
# "Set up secure CI/CD for my Node.js app"
```

## 📝 Agent File Structure

Each agent is a markdown file with YAML frontmatter:

```markdown
---
name: my-expert
description: An expert in specific domain
model: sonnet  # opus for complex tasks, haiku for simple
version: 1.0.0
tags: [frontend, react, typescript]
---

You are an expert assistant specialized in...

## Core Expertise
- List your key competencies
- Technologies you master
- Domains you excel in

## Approach
1. How you analyze problems
2. How you provide solutions
3. Your communication style

## Best Practices
- Industry standards you follow
- Patterns you recommend
- Anti-patterns you avoid
```

### 🧩 SDK Usage

```typescript
import { 
  Agent, 
  AgentManager,
  ClaudeCodeIntegration 
} from 'claude-agents-framework';

// Create and deploy programmatically
const agent = new Agent({
  metadata: {
    name: 'api-expert',
    description: 'REST and GraphQL API design expert',
    model: 'sonnet'
  },
  content: 'You are an API expert...'
});

// Deploy directly to Claude Code
const integration = new ClaudeCodeIntegration();
await integration.deployAgent(agent);
```

### 🔄 Auto-Sync Workflow

```bash
# Watch for changes and auto-deploy
claude-agents watch ~/.claude/agents

# Sync from GitHub
claude-agents sync --from-git https://github.com/user/my-agents
```

### 🧪 Testing Agents

```yaml
# test-react-expert.yaml
- name: Component optimization
  input: "How to optimize React re-renders?"
  shouldContain: ["memo", "useMemo", "useCallback"]
  
- name: Best practices
  input: "React folder structure?"
  shouldContain: ["components", "hooks", "utils"]
```

```bash
claude-agents test react-expert --test-file test-react-expert.yaml
```

## 🤝 Model Selection Guide

Choose the right model for your agents:

| Model | Best For | Examples |
|-------|----------|----------|
| **Opus** | Complex reasoning, architecture design | System architects, security analysts |
| **Sonnet** | Standard development, balanced performance | React experts, API designers |
| **Haiku** | Quick responses, simple tasks | Formatters, linters, simple helpers |

## 🔥 Why Claude Agents Framework?

### Without Framework
- Generic Claude responses
- No domain specialization  
- Constant context switching
- Inconsistent expertise

### With Framework
- ✅ Hyper-specialized responses
- ✅ Deep domain knowledge
- ✅ Consistent expert behavior
- ✅ Deploy in seconds

## 🛡️ Troubleshooting

### Agents not loading in Claude Code?
```bash
# Check deployment status
claude-agents deploy --status

# Verify agents location
ls ~/.claude/agents/

# Re-deploy
claude-agents deploy
```

### Permission errors?
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Or use without sudo
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

## 🚀 What's Next?

### Coming Soon
- 🌐 **Agent Marketplace**: Share agents with the community
- 🔄 **Hot Reload**: Agents update without restarting Claude
- 📊 **Analytics**: Track which agents are used most
- 🤖 **AI Agent Builder**: Generate agents using AI

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👨‍💻 Creator

Built with ❤️ by **Lorenzo De Tomasi**

Transform Claude into your personal tech army with specialized AI agents!

---

<div align="center">

### ⭐ Star this repo if it helps you build better!

[GitHub](https://github.com/lorenzodetomasi/claude-agents-framework) • [Report Issues](https://github.com/lorenzodetomasi/claude-agents-framework/issues) • [Request Features](https://github.com/lorenzodetomasi/claude-agents-framework/issues)

</div>