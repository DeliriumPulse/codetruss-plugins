# CodeTruss agent plugins

Open integration wrappers that teach Claude Code, Codex, and other Agent Skills
clients to use the local-first CodeTruss CLI as an acceptance gate for
AI-generated changes.

The integrations do not contain an analyzer, upload source code, or call a
CodeTruss service. They invoke the separately installed CLI, keep deterministic
analysis on the developer's machine, and require explicit consent before
installation, provider-backed `--llm` review, authentication, or receipt
`sync`.

## Prerequisites

- Git
- Node.js 20.9 or newer
- The free CodeTruss CLI from <https://codetruss.com/cli>

The skill can explain the official installer when the CLI is missing, but it
must not install software without the developer's confirmation.

## Claude Code

```bash
claude plugin marketplace add DeliriumPulse/codetruss-plugins
claude plugin install codetruss@codetruss
```

The owned marketplace is live now. The same validated plugin is prepared for
Anthropic's reviewed community marketplace but has not been submitted. The
automatically available official marketplace is separately curated at
Anthropic's discretion.

## Codex

```bash
codex plugin marketplace add DeliriumPulse/codetruss-plugins
codex plugin add codetruss@codetruss
```

The validated skills-only bundle is ready for OpenAI's Plugin Directory. The
owned marketplace is live now; public-directory submission has not occurred and
still requires a verified publisher with Apps Management write access.

## What the skill does

- proposes a narrow repository allow/deny policy and verification commands;
- runs `codetruss init` only after the developer confirms the boundary;
- installs and diagnoses the existing Claude Code or Codex lifecycle hook;
- reviews working-tree or staged changes and interprets the resulting receipt;
- treats exit codes 1 and 2 as product verdicts with valid evidence, not generic
  shell failures;
- refuses to weaken policy merely to manufacture a green verdict.

The canonical Agent Skills definition is in `skills/codetruss/`. Platform
packages contain byte-identical copies so each marketplace archive is
self-contained.

## Development

```bash
npm test
claude plugin validate ./plugins/codetruss-claude
python3 /path/to/plugin-creator/scripts/validate_plugin.py ./plugins/codetruss
npm run release:verify
```

`npm test` uses only Node.js built-ins and verifies manifests, marketplace
entries, skill parity, privacy guardrails, and submission-case counts.
`npm run release:verify` builds the OpenAI and Claude submission archives twice
from the committed Git tree and proves their bytes are reproducible.

## Security and support

Read [SECURITY.md](SECURITY.md) before reporting a vulnerability. General
wrapper issues belong in this repository; CLI issues belong in the
[CodeTruss CLI tracker](https://github.com/DeliriumPulse/codetruss-cli/issues).
Never attach third-party source, credentials, or unredacted receipts to a public
issue.

## Licensing boundary

The manifests and skill instructions in this repository are MIT licensed. The
separately installed CodeTruss CLI is free to use under the CodeTruss CLI
Proprietary License and CodeTruss Terms of Service. This repository does not
make the CLI open source and does not redistribute its executable bundle.
