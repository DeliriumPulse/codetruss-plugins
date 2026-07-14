# CodeTruss for Claude Code

This plugin teaches Claude Code to operate the separately installed free
CodeTruss CLI as a local acceptance gate for coding-agent changes.

Prerequisites:

- Git
- Node.js 20.9 or newer
- CodeTruss CLI v0.2.14 or newer from <https://codetruss.com/cli>

The plugin contains no analyzer, bundled hook, MCP server, background service,
or upload path. It delegates hook installation to the tested CLI after developer
confirmation. Deterministic checks stay local. Provider-backed review,
authentication, and receipt sync require separate explicit developer actions.

Troubleshooting:

- Run `codetruss --version`; install or upgrade from the CLI page when it is
  missing or older than v0.2.14.
- Run `codetruss hooks status claude` and `codetruss hooks doctor claude`
  before changing or reinstalling Claude settings.
- Exit 1 means `REVIEW_REQUIRED`, exit 2 means `FAILED`, and both still produce
  a receipt. Exit 3 is a usage or environment failure.
- Report wrapper problems at <https://github.com/DeliriumPulse/codetruss-plugins/issues>
  and CLI/security problems at <https://github.com/DeliriumPulse/codetruss-cli/issues>.
- Follow <https://codetruss.com/security> for private vulnerability reporting
  and the current product security boundary.

The wrapper files in this package are MIT licensed. The separately installed
CLI is source-visible and free to use under the CodeTruss CLI Proprietary
License and CodeTruss Terms of Service.
