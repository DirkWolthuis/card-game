# Definition of Done (DOD)

This document outlines the acceptance criteria that all contributions to the Lords of Estraven Card Game project must meet before being considered complete and ready for merge.

---

## Table of Contents
- [Code Quality](#code-quality)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Requirements](#pull-request-requirements)
- [CI/CD Requirements](#cicd-requirements)
- [Code Review](#code-review)

---

## Code Quality

### Linting
- [ ] All code passes ESLint with no errors
- [ ] Run `pnpm nx run-many --target=lint --all` successfully
- [ ] No new linting warnings introduced (existing warnings acceptable)
- [ ] Code follows the project's ESLint configuration

### Type Safety
- [ ] TypeScript code compiles without errors
- [ ] No use of `any` type without explicit justification and eslint-disable comment
- [ ] Type definitions are complete and accurate

### Code Style
- [ ] Code is formatted according to Prettier configuration (`.prettierrc`)
- [ ] Code follows existing patterns and conventions in the codebase
- [ ] Meaningful variable and function names
- [ ] No commented-out code (unless there's a specific documented reason)

### Architecture
- [ ] Code respects Nx module boundaries (`@nx/enforce-module-boundaries`)
- [ ] New dependencies are justified and minimal
- [ ] Shared logic is placed in appropriate library packages (`libs/`)
- [ ] Application-specific code stays in app packages (`apps/`)

---

## Testing

### Test Coverage
- [ ] New features have corresponding unit tests
- [ ] Bug fixes include a test that would have caught the bug
- [ ] All tests pass: `pnpm nx run-many --target=test --all`
- [ ] Test coverage for new code is reasonable (aim for >80% for critical paths)

### Test Quality
- [ ] Tests are meaningful and test actual behavior, not implementation details
- [ ] Tests follow existing patterns in the codebase (Jest or Vitest as appropriate)
- [ ] Test descriptions clearly state what is being tested
- [ ] Tests are isolated and do not depend on execution order
- [ ] Mock dependencies appropriately

### E2E Tests (when applicable)
- [ ] Critical user flows have E2E tests using Playwright
- [ ] E2E tests are stable and not flaky

---

## Documentation

### Code Documentation
- [ ] Complex logic has explanatory comments
- [ ] Public APIs have JSDoc comments when appropriate
- [ ] README files updated if new libraries or apps are added

### Project Documentation
- [ ] Changes to game mechanics are reflected in `docs/game-design.md`
- [ ] New card types or politics are documented in relevant docs (e.g., `docs/politics-in-estraven-set.md`)
- [ ] Breaking changes are documented in PR description

### User-Facing Documentation
- [ ] User-facing features have appropriate documentation
- [ ] Documentation is clear, concise, and accurate

---

## Pull Request Requirements

### PR Description
- [ ] PR has a clear title that summarizes the change
- [ ] PR description explains:
  - What was changed
  - Why it was changed
  - How to test the changes
- [ ] References related issue(s) using `Fixes #123` or `Closes #123`
- [ ] Screenshots included for UI changes

### Branch and Commits
- [ ] Branch name follows convention (e.g., `feature/`, `fix/`, `docs/`, `copilot/`)
- [ ] Commits have meaningful messages
- [ ] Commit history is clean (squash if necessary)

### Code Changes
- [ ] Changes are minimal and focused on the issue at hand
- [ ] No unrelated changes included
- [ ] No debug code or console.logs left in (unless intentional)
- [ ] No sensitive data (API keys, secrets, etc.) committed

---

## CI/CD Requirements

### GitHub Actions
- [ ] All CI checks pass (`.github/workflows/pr-checks.yml`)
- [ ] Linting step passes
- [ ] Testing step passes
- [ ] No build errors

### Dependencies
- [ ] Dependencies installed with `pnpm install --frozen-lockfile`
- [ ] `pnpm-lock.yaml` is updated if dependencies changed
- [ ] No security vulnerabilities in new dependencies

---

## Code Review

### Review Process
- [ ] At least one approval from a project maintainer
- [ ] All review comments addressed or discussed
- [ ] No unresolved conversations

### Code Quality Review
- [ ] Code is readable and maintainable
- [ ] No obvious bugs or edge cases missed
- [ ] Performance considerations addressed if applicable
- [ ] Security best practices followed

### Testing Review
- [ ] Tests adequately cover the changes
- [ ] Tests are not brittle or flaky
- [ ] Test assertions are meaningful

---

## Additional Considerations

### For New Features
- [ ] Feature aligns with game design philosophy
- [ ] UX/UI is intuitive and consistent with existing patterns
- [ ] Accessibility considerations addressed
- [ ] Performance impact is acceptable

### For Bug Fixes
- [ ] Root cause identified and addressed
- [ ] Similar issues in other parts of codebase checked
- [ ] Regression test added

### For Refactoring
- [ ] Behavior remains unchanged (verified by tests)
- [ ] Justification for refactoring is clear
- [ ] Scope is reasonable and focused

---

## Quick Checklist

Before submitting your PR, run through this quick checklist:

```bash
# 1. Install dependencies
pnpm install --frozen-lockfile

# 2. Run linting
pnpm nx run-many --target=lint --all

# 3. Run tests
pnpm nx run-many --target=test --all

# 4. Check your changes
git status
git diff

# 5. Commit with a meaningful message
git commit -m "descriptive message"
```

---

## Notes for Copilot Agent

When working on issues, the Copilot agent should:
- Review this DOD at the start of each task
- Ensure all applicable items are completed before finalizing work
- Use the quick checklist to validate changes
- Add DOD items as verification steps in the work plan
- Flag any DOD items that cannot be met and explain why

---

*This document should evolve with the project. If you find items that should be added or changed, please submit a PR with your suggestions.*
