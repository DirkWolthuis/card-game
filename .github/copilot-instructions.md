# GitHub Copilot Instructions

When working on issues or pull requests in this repository, always follow these guidelines:

## Required Reading

Before starting any task, review the [Definition of Done](../docs/DEFINITION_OF_DONE.md). All contributions must meet the standards outlined in this document.

## Key Requirements

### Code Quality
- Run `pnpm nx run-many --target=lint --all` before committing
- Ensure TypeScript types are properly defined
- Follow Nx module boundaries
- No use of `any` type without justification

### Testing
- Run `pnpm nx run-many --target=test --all` before submitting
- New features require unit tests
- Bug fixes require regression tests
- Aim for >80% coverage on critical paths

### Documentation
- Update `docs/game-design.md` for game mechanic changes
- Update relevant docs for new card types or politics
- Include clear PR descriptions with rationale

### Project-Specific Patterns
- This is an Nx monorepo with TypeScript
- Use pnpm with `--frozen-lockfile` for dependencies
- Place shared logic in `libs/` packages
- Keep app-specific code in `apps/` packages

## Validation Checklist

Before finalizing any work:

```bash
pnpm install --frozen-lockfile
pnpm nx run-many --target=lint --all
pnpm nx run-many --target=test --all
```

All checks must pass before the work is considered complete.

## Reference Documents
- [Definition of Done](../docs/DEFINITION_OF_DONE.md) - **REQUIRED**
- [Game Design](../docs/game-design.md)
- [Contributing Guide](../CONTRIBUTING.md)
