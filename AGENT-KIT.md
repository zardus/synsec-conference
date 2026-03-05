# SynSec Agent Kit (v3)

Quick local validation for `ai-cfp.json` consumers.

## Validate current CFP JSON

```bash
node tools/validate-ai-cfp.js ai-cfp.json
```

## Validate examples

```bash
node tools/validate-ai-cfp.js examples/ai-cfp.valid.min.json
node tools/validate-ai-cfp.js examples/ai-cfp.invalid.missing-fields.json
```

The validator is intentionally lightweight and dependency-free for easy use in agent sandboxes.
For strict schema validation, use `ai-cfp.schema.json` with a full JSON Schema validator.
