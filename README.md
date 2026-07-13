# Personal Brand MCP

**Positioning, bios, content pillars, platform strategy — the frameworks for building an audience that buys, not just watches.**

> **Disclaimer.** Structured positioning frameworks from documented practice. Growth varies with consistency, proof quality, and niche.

## Why This Exists

Every creator's AI assistant gets asked the same four questions: who is my content for, what should my bio say, what should I post, and which platform matters. Most agents answer with vibes. This MCP answers with frameworks and audits — and it refuses to let positioning outrun proof.

The house rule: **positioning without receipts is a costume.**

## 7 Tools

| Tool | What it returns |
|---|---|
| `get_positioning_framework` | The niche statement formula (WHO x OUTCOME x HOW x RECEIPT), 4 checks, proof inventory, moat check |
| `audit_bio` | PASS/NEEDS WORK per platform: char limits, hype titles, title-first openers, missing outcome |
| `get_bio_rules` | Bio architecture per platform (tiktok, instagram, linkedin, x, youtube) |
| `get_content_pillars` | The 4-pillar system: receipts ~30%, method ~40%, story ~20%, conversion ~10% |
| `get_platform_strategy` | Each platform's strategic role, conversion path, cadence floor, watch-out |
| `interpret_growth_signal` | What your growth pattern means (high views/flat followers, high DMs/low sales...) and the fix |
| `get_full_pack` | Everything in one payload |

## Install

```bash
npx personal-brand-mcp        # once published to npm
# or from source:
git clone https://github.com/closermethod/personal-brand-mcp && cd personal-brand-mcp && npm i && npm run build && node dist/main.js
```

Claude Desktop config:
```json
{ "mcpServers": { "personal-brand": { "command": "npx", "args": ["personal-brand-mcp"] } } }
```

## The Family

Get positioned (this one) → get seen ([content-hooks-mcp](https://github.com/closermethod/content-hooks-mcp)) → get the reply ([outbound-engine-mcp](https://github.com/closermethod/outbound-engine-mcp)) → price the deal ([creator-deals-mcp](https://github.com/closermethod/creator-deals-mcp)) → own the audience ([newsletter-growth-mcp](https://github.com/closermethod/newsletter-growth-mcp)). Full catalog: [MCP Hub](https://elisabethhitz-mcp.netlify.app)

## Built By

[Elisabeth Hitz](https://www.linkedin.com/in/elisabethhitz) — 10+ years enterprise sales, reverse-engineered for creators.

License: MIT
