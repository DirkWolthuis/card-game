# Contributing to Lords of Estraven Card Game

Thank you for your interest in contributing to the Lords of Estraven Card Game project!

## Getting Started

1. **Fork and clone** the repository
2. **Install dependencies**: `pnpm install --frozen-lockfile`
3. **Review the [Definition of Done](docs/DEFINITION_OF_DONE.md)** - All contributions must meet these standards

## Definition of Done

Before submitting any pull request, please ensure your contribution meets all applicable criteria in our [Definition of Done](docs/DEFINITION_OF_DONE.md).

Key requirements include:
- ✅ All linting passes: `pnpm nx run-many --target=lint --all`
- ✅ All tests pass: `pnpm nx run-many --target=test --all`
- ✅ Code follows TypeScript best practices
- ✅ New features have corresponding tests
- ✅ Documentation is updated as needed

## Development Workflow

### Running the Project

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Serve the UI
pnpm serve:ui

# Run linting
pnpm nx run-many --target=lint --all

# Run tests
pnpm nx run-many --target=test --all
```

### Submitting Changes

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes following the [Definition of Done](docs/DEFINITION_OF_DONE.md)
3. Run linting and tests locally
4. Commit with a descriptive message
5. Push to your fork and create a pull request
6. Ensure all CI checks pass
7. Address any review feedback

## Code Style

- Follow the existing code patterns
- Use TypeScript with proper type definitions
- Format code with Prettier (automatic via `.prettierrc`)
- Follow ESLint rules (see `eslint.config.mjs`)

## Project Structure

This is an Nx monorepo:
- `apps/` - Application projects (game-ui, game-server)
- `libs/` - Shared library packages (game-core, game-models, game-data)
- `docs/` - Project documentation

## Questions?

If you have questions about contributing, please open an issue for discussion.

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT License.
