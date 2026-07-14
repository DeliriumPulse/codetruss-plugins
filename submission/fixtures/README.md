# Reviewer fixtures

These fixtures make the five positive OpenAI skill tests reproducible without
placing source code, credentials, or a CodeTruss account in the submission.

Prerequisites: Git, Node.js 20.9 or newer, CodeTruss CLI v0.2.14 or newer, and
the CodeTruss plugin under review.

Generate all repositories:

```bash
node submission/fixtures/setup.mjs /tmp/codetruss-plugin-fixtures
```

The script recreates the destination and makes deterministic initial commits.

## Positive-test mapping

1. `configure-boundary`: start here for repository setup. It intentionally has
   no `.codetruss.yml`. Ask the plugin to allow `src/**` and `tests/**`, deny
   `infra/production/**` and `.env*`, use `npm run lint` plus `npm test`, and
   install the Codex hook.
2. `review-working-tree`: contains an uncommitted `src/rate-limit.ts` change and
   a valid policy. Ask the plugin to review it for the password-reset
   rate-limiting task.
3. `review-staged`: contains staged `src/staged.ts` and unstaged
   `src/unstaged.ts`. Ask for a staged-only pre-commit review and confirm the
   receipt excludes the unstaged path.
4. `diagnose-claude-hook`: contains a stale Claude Stop-hook command. Ask the
   plugin to diagnose it without deleting or reinstalling settings first.
5. `verify-receipt`: contains an uncommitted `src/receipt.ts` change. Create the
   signed local receipt, then ask the plugin to verify and explain it:

   ```bash
   cd /tmp/codetruss-plugin-fixtures/verify-receipt
   codetruss review --task "Add the receipt fixture" --no-verify
   ```

Exit 1 or 2 is a product verdict and still creates the receipt required by the
test. No fixture invokes `--llm`, authentication, or sync.
