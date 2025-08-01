# 📦 Publishing to npm

## Prerequisites

1. **Create npm account** (if you don't have one):
   - Go to https://www.npmjs.com/signup
   - Verify your email

2. **Login to npm**:
   ```bash
   npm login
   # Enter your username, password, and email
   ```

## Publishing Steps

### 1. Build the project
```bash
npm run build
```

### 2. Test locally (optional but recommended)
```bash
# Create a tarball
npm pack

# Test in another directory
cd /tmp
npm install /path/to/claude-agents-framework-1.0.0.tgz
npx claude-agents --help
```

### 3. Publish to npm

#### First time publishing:
```bash
npm publish
```

#### If the name is taken, you have two options:

**Option A: Scoped package** (recommended)
```bash
# Update package.json name to:
# "name": "@lorenzodetomasi/claude-agents-framework"

npm publish --access public
```

**Option B: Different name**
```bash
# Update package.json name to something unique like:
# "name": "claude-agents-builder"
# "name": "claude-code-agents"
# "name": "claude-specialist-framework"

npm publish
```

### 4. Verify publication
```bash
# Check on npm
npm info claude-agents-framework

# Or visit
# https://www.npmjs.com/package/claude-agents-framework
```

## Post-Publication

### Update README installation instructions:
```bash
# From:
git clone https://github.com/lorenzodetomasi/claude-agents-framework.git

# To:
npm install -g claude-agents-framework
```

### Create GitHub release:
1. Go to https://github.com/lorenzodetomasi/claude-agents-framework/releases
2. Click "Create a new release"
3. Tag: v1.0.0
4. Title: "v1.0.0 - Initial Release"
5. Description: List main features

## Version Updates

When making changes:

```bash
# Patch version (1.0.0 -> 1.0.1) for bug fixes
npm version patch

# Minor version (1.0.0 -> 1.1.0) for new features
npm version minor

# Major version (1.0.0 -> 2.0.0) for breaking changes
npm version major

# Then publish
npm publish
```

## Troubleshooting

### Name already taken?
Use a scoped package: `@yourusername/claude-agents-framework`

### Permission denied?
Make sure you're logged in: `npm whoami`

### 402 Payment Required?
For scoped packages, add: `--access public`