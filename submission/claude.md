# Claude community submission draft

Status: **Prepared and locally validated; not submitted or approved.** This is
for the reviewed community marketplace. Official-marketplace inclusion is a
separate Anthropic-curated decision.

- Plugin: `codetruss`
- Repository: <https://github.com/DeliriumPulse/codetruss-plugins>
- Package path: `plugins/codetruss-claude`
- Submitter email: `zack@codetruss.com`
- Supported platform: `Claude Code`
- Wrapper license: `MIT`
- Terms acknowledgement: confirm in the Console form after reviewing the final
  submission.
- Homepage: <https://codetruss.com/cli>
- Logo: <https://codetruss.com/brand/codetruss-mark-512.png> (512 × 512;
  SHA-256 `2c46b3aca474ec80918333b6331326ef6f1df6d4a09d48c4f4f9f128dc3d45b8`)
- Support: <https://github.com/DeliriumPulse/codetruss-cli/issues>
- Privacy: <https://codetruss.com/privacy>
- Terms: <https://codetruss.com/terms>

Description:

> Verify the acceptance contract for Claude Code changes before commit. Keep
> changes inside the approved task, run deterministic local analyzers and
> repository verification, and produce a verifiable receipt. The
> skill installs CodeTruss's existing project hook only after the developer
> confirms repository scope. Deterministic review uploads nothing. Optional
> `--llm` sends the reviewed diff directly to the developer's chosen provider;
> explicit sync uploads only a redacted receipt and never the patch. Requires
> the separately installed free CodeTruss CLI; no CodeTruss account or upload
> is required for local use. The wrapper is MIT licensed; the CLI is
> source-visible under the CodeTruss CLI Proprietary License.

## Example use cases

1. Configure a narrow acceptance boundary for a repository by inspecting its
   existing scripts, proposing allow/deny globs, and installing the Claude Code
   hook only after developer confirmation.
2. Review the current working-tree or staged changes against the stated task,
   then explain every scope, sensitive-surface, analyzer, and verification
   reason in the resulting verdict.
3. Verify the latest receipt and explain the difference between post-generation
   integrity evidence, trusted execution, authorship, and compliance.

Pre-submission evidence:

- `claude plugin validate ./plugins/codetruss-claude`
- clean-profile marketplace add and install
- PASS, REVIEW_REQUIRED, and FAILED fixture runs
- public CodeTruss CLI v0.2.14 installer and attested GitHub release availability
- MIT wrapper license and explicit proprietary CLI boundary
