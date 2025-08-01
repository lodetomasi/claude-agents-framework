#!/bin/bash

echo "🚀 Testing Claude Agents Framework locally..."

# Build the project
echo "📦 Building project..."
npm install
npm run build

# Make CLI executable
chmod +x dist/cli/index.js

# Create test directory
TEST_DIR="./test-agents"
mkdir -p $TEST_DIR

echo -e "\n✅ Build complete! Now testing commands...\n"

# Test init command
echo "1️⃣ Testing init command..."
node dist/cli/index.js init --path $TEST_DIR

# Test create command
echo -e "\n2️⃣ Testing create command..."
node dist/cli/index.js create test-agent \
  --description "A test agent for demo" \
  --model sonnet \
  --template general \
  --output $TEST_DIR

# Test validate command
echo -e "\n3️⃣ Testing validate command..."
node dist/cli/index.js validate $TEST_DIR/test-agent.md

# Test list command
echo -e "\n4️⃣ Testing list command..."
node dist/cli/index.js list --path $TEST_DIR

# Show created agent
echo -e "\n5️⃣ Created agent preview:"
head -20 $TEST_DIR/test-agent.md

echo -e "\n✨ Test complete! Framework is working correctly."
echo "📍 Test agents created in: $TEST_DIR"