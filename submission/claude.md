# Claude community submission draft

- Plugin: `codetruss`
- Repository: <https://github.com/DeliriumPulse/codetruss-plugins>
- Package path: `plugins/codetruss-claude`
- Homepage: <https://codetruss.com/cli>
- Support: <https://github.com/DeliriumPulse/codetruss-cli/issues>
- Privacy: <https://codetruss.com/privacy>
- Terms: <https://codetruss.com/terms>

Description:

> Keep Claude Code changes inside the approved task, run deterministic local
> analyzers and repository verification, and produce a verifiable receipt. The
> skill installs CodeTruss's existing project hook only after the developer
> confirms repository scope. It never uploads code; provider review and receipt
> sync remain explicit opt-ins.

Pre-submission evidence:

- `claude plugin validate ./plugins/codetruss-claude`
- clean-profile marketplace add and install
- PASS, REVIEW_REQUIRED, and FAILED fixture runs
- public CodeTruss CLI v0.2.13 installer and attested GitHub release availability
- MIT wrapper license and explicit proprietary CLI boundary
