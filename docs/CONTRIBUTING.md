# CONTRIBUTING.md - ORUS Builder

Thank you for your interest in contributing to ORUS Builder! 🚀

We welcome contributions from developers of all skill levels. Whether you're fixing bugs, adding features, improving documentation, or spreading the word, your help is invaluable.

---

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

**TL;DR:** Be respectful, inclusive, and professional.

---

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Fork the repository on GitHub
# Then clone your fork locally
git clone https://github.com/YOUR-USERNAME/orus-builder.git
cd orus-builder
```

### 2. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

**Branch naming:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `chore/` - Build, dependencies, tooling

### 3. Setup Development Environment

```bash
# Install dependencies
npm install

# Install pre-commit hooks
npm run prepare

# Setup environment
cp .env.example .env
# Edit .env with your API keys
```

### 4. Make Your Changes

```bash
# Create focused commits
git commit -m "feat: add support for Claude AI provider"

# Follow commit conventions:
# feat: a new feature
# fix: a bug fix
# docs: documentation only changes
# refactor: code refactoring without feature changes
# test: adding or updating tests
# chore: updating dependencies, build scripts
```

---

## 📋 Contribution Types

### 🐛 Bug Reports

1. Check [existing issues](https://github.com/tulio-orus/orus-builder/issues)
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs. actual behavior
   - Environment info (OS, Node version, provider used)
   - Screenshots if applicable

### ✨ Feature Requests

1. Discuss in [GitHub Discussions](https://github.com/tulio-orus/orus-builder/discussions)
2. Include:
   - Use case and motivation
   - Proposed solution
   - Alternatives considered
   - Potential impact

### 📚 Documentation

1. Spelling/grammar fixes: Submit directly in a PR
2. New documentation:
   - Create in `/docs`
   - Follow existing markdown style
   - Include examples
   - Link to related docs

### 💻 Code Contributions

**Before starting:**
1. Check if a related issue exists
2. Comment "I'd like to work on this" to avoid duplicates
3. Wait for approval from maintainers

**Process:**
1. Fork and create a feature branch
2. Make changes following our [Code Standards](#code-standards)
3. Add/update tests
4. Test locally: `npm run test`
5. Push and create a Pull Request

---

## 🎯 Code Standards

### TypeScript

```typescript
// Use strict typing
interface UserResponse {
  id: string;
  email: string;
  createdAt: Date;
}

// Always add JSDoc comments for public APIs
/**
 * Generates code from a natural language prompt
 * @param prompt - The natural language description
 * @param provider - The AI provider to use
 * @returns Generated TypeScript code
 */
export async function generateCode(
  prompt: string,
  provider: AIProvider
): Promise<string> {
  // Implementation
}
```

### Testing

```bash
# Write tests for new features
npm run test

# Check coverage
npm run test:coverage

# All tests must pass before PR
npm run test:e2e
```

### Linting & Formatting

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix

# Format code
npm run format

# All checks pass: npm run check
```

---

## 🔄 Pull Request Process

1. **Update your branch** with latest `main`
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Create a meaningful PR title**
   ```
   feat: add Claude AI provider support
   fix: correct CIG protocol validation bug
   docs: update deployment guide for Vercel
   ```

3. **Fill out the PR template:**
   - Description of changes
   - Related issues (#123)
   - Type of change (feature/fix/docs/refactor)
   - Testing instructions
   - Screenshots if UI changes

4. **Wait for review**
   - Maintainers will review code
   - Address feedback constructively
   - Push updates to same branch

5. **Merge**
   - Once approved, maintainers will merge
   - Your changes will be in next release

---

## 🏗️ Architecture Guidelines

### When Adding Features

1. **Follow existing patterns:**
   - Study similar components
   - Use same naming conventions
   - Maintain folder structure

2. **Consider CIG Protocol:**
   - All generated code must be 100% type-safe
   - No runtime type coercion
   - Strict validation for inputs

3. **Documentation:**
   - Update relevant docs
   - Add inline code comments
   - Include examples

4. **Performance:**
   - Aim for <100ms response time
   - Add caching where applicable
   - Profile before optimizing

5. **Security:**
   - Validate all inputs
   - No hardcoded secrets
   - Use parameterized queries

---

## 🧪 Testing Requirements

### Unit Tests

```typescript
describe('CognitiveGenerationEngine', () => {
  it('should generate valid TypeScript code', async () => {
    const engine = new CognitiveGenerationEngine();
    const code = await engine.generate('create a user model');
    expect(code).toContain('interface User');
  });
});
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests

```bash
npm run test:e2e
```

**Requirements:**
- ✅ 80%+ code coverage
- ✅ All new features have tests
- ✅ All tests pass locally
- ✅ No flaky tests

---

## 📚 Documentation Standards

### README Files
- Clear overview
- Quick start section
- Links to detailed guides
- Installation instructions

### Guide Files
- Table of contents
- Step-by-step instructions
- Code examples
- Troubleshooting section

### Code Comments
```typescript
// Bad: Obvious comments
const x = 5; // Set x to 5

// Good: Explain WHY, not WHAT
const maxRetries = 5; // Allow max 5 attempts before exponential backoff
```

---

## 🔐 Security

Found a vulnerability? **Do NOT open a public issue.**

Instead:
1. Email: `security@orusbuilder.dev`
2. Or use: [GitHub Security Advisory](https://github.com/tulio-orus/orus-builder/security/advisories)
3. Include: Description, impact, proof-of-concept

We'll respond within 48 hours.

---

## 💬 Getting Help

- **Questions:** Use [GitHub Discussions](https://github.com/tulio-orus/orus-builder/discussions)
- **Bugs:** Open [Issue](https://github.com/tulio-orus/orus-builder/issues)
- **Ideas:** Start [Discussion](https://github.com/tulio-orus/orus-builder/discussions/new)
- **Chat:** Join our [Discord Community](https://discord.gg/orus-builder)

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🎉 Thank You!

Your contributions make ORUS Builder better for everyone. We genuinely appreciate your help! 🙏

For questions, reach out to the maintainers or community.

Happy coding! ✨
