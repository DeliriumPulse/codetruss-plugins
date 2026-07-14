# Publisher submission checklist

The packages are technically ready, but these account-level gates must be
completed by the verified publisher. Do not describe either listing as
submitted or approved until the vendor portal confirms that state.

## OpenAI Plugin Directory

1. In the publishing OpenAI Platform organization, complete business identity
   verification under the exact public operator name `CodeTruss`. If only
   individual verification is available, first align the plugin publisher,
   website operator, support identity, privacy policy, and terms to that
   verified identity.
2. Confirm the submitter role has `Apps Management: Write`.
3. Choose `Skills only` and gate the listing to Codex. The plugin requires a
   local Git checkout and executable CLI; it is not a ChatGPT Work web workflow.
4. Upload `codetruss-openai-plugin-v0.1.2.zip` from the matching GitHub release,
   the checksum-pinned 512×512 logo, the three starter prompts, exactly five
   positive tests, and exactly three negative tests from `submission/openai.md`.
5. Select all portal-supported regions intended for launch, review the public
   prerequisite/licensing text, and submit. Approval still requires an explicit
   Publish action in the portal.

An OpenAI API key or project membership does not satisfy identity verification
or Apps Management permission.

## Anthropic community marketplace

1. Use the Anthropic Console submission form with repository
   `https://github.com/DeliriumPulse/codetruss-plugins` and plugin path
   `plugins/codetruss-claude`.
2. Select `Claude Code` only. Cowork has not been tested and must not be claimed.
3. Copy the description and three examples from `submission/claude.md`, use
   `zack@codetruss.com`, identify the wrapper license as MIT, review the terms,
   and submit.
4. Record the reviewed commit SHA. Approved third-party submissions enter the
   `claude-community` marketplace. The automatically available official
   marketplace is separately curated at Anthropic's discretion.

## Evidence to retain

- vendor submission ID and timestamp;
- exact Git commit, release URL, archive SHA-256, and logo SHA-256;
- successful `gh attestation verify <archive> --repo DeliriumPulse/codetruss-plugins` output;
- screenshots of the final submitted fields;
- review status and every requested remediation;
- approval and publication timestamps as separate events.
