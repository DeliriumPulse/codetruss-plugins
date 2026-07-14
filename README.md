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

The same plugin will be submitted to Anthropic's reviewed `claude-community`
marketplace after the public CLI release is live.

## Codex

```bash
codex plugin marketplace add DeliriumPulse/codetruss-plugins
codex plugin add codetruss@codetruss
```

The skills-only plugin will also be submitted to OpenAI's universal Plugin
Directory after clean-profile installation tests pass.

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
```

`npm test` uses only Node.js built-ins and verifies manifests, marketplace
entries, skill parity, privacy guardrails, and submission-case counts.

## Licensing boundary

The manifests and skill instructions in this repository are MIT licensed. The
separately installed CodeTruss CLI is free to use under the CodeTruss CLI
Proprietary License and CodeTruss Terms of Service. This repository does not
make the CLI open source and does not redistribute its executable bundle.
