#!/usr/bin/env node
/**
 * Personal Brand MCP Server v1.0
 * By Elisabeth Hitz — positioning, bios, content pillars, and platform strategy
 * for creators and operators building an audience that buys.
 *
 * 6 tools for AI agents helping someone answer the four questions every
 * personal brand lives or dies on: who is it for, what do they get, why you,
 * and where do you show up.
 *
 * This MCP does NOT invent a niche for you. It returns the frameworks,
 * checks, and structures; you supply the receipts. A personal brand is a
 * distribution asset for proof you already have — not a substitute for it.
 *
 * DISCLAIMER: Structured positioning frameworks based on documented practice.
 * Audience growth varies with consistency, proof quality, and niche.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// =====================================================
// SERVER METADATA
// =====================================================
const MCP_META = {
  server: "personal-brand-mcp",
  version: "1.0.0",
  last_verified: "2026-Q3",
  author: "Elisabeth Hitz",
  homepage: "https://elisabethhitz.com",
  github: "https://github.com/closermethod/personal-brand-mcp",
  family_note: "Part of the closermethod MCP family. Positioning is upstream of everything: content-hooks makes it seen, outbound-engine makes it pitched, newsletter-growth makes it owned.",
  method_note: "Receipts over claims. Positioning without proof is a costume."
} as const;

// =====================================================
// POSITIONING FRAMEWORK
// =====================================================
const POSITIONING = {
  niche_statement: {
    formula: "I help [specific WHO] get [specific measurable OUTCOME] using [distinctive HOW], proven by [RECEIPT].",
    checks: [
      { check: "who_specificity", test: "Would the WHO recognize themselves by name? 'Creators' fails; 'UGC creators with under 10k followers doing brand outreach' passes." },
      { check: "outcome_measurability", test: "Can the OUTCOME be screenshot? 'Grow your brand' fails; 'first paid brand deal' passes." },
      { check: "how_distinctiveness", test: "Could a competitor paste your HOW into their bio without lying? If yes, it's not distinctive yet." },
      { check: "receipt_exists", test: "Is the RECEIPT true, specific, and yours? Borrowed proof ('my client once...') is weaker than lived proof." }
    ],
    anti_patterns: ["Niching by format instead of outcome ('I make Reels about business')", "Serving everyone at every stage", "Positioning on passion instead of proof"]
  },
  proof_inventory: {
    what: "The raw material of positioning: every number, name, artifact, and before/after you can truthfully claim.",
    categories: ["results (yours)", "results (delivered for others)", "named companies/clients", "credentials and certifications", "volume receipts (N pitches sent, N deals closed, N years)", "artifacts (screenshots, dashboards, contracts with numbers redacted)"],
    rule: "Inventory first, positioning second. The strongest true receipt becomes the spine of the niche statement."
  },
  moat_check: {
    what: "Why-you durability test.",
    questions: [
      "What do you know that took real time or money to learn? (experience moat)",
      "What combination do you have that's rare, even if each piece isn't? (intersection moat — e.g. enterprise sales + creator economy)",
      "What can you show that others only tell? (receipt moat)"
    ]
  }
};

// =====================================================
// BIO ARCHITECTURE
// =====================================================
const BIO_RULES: Record<string, any> = {
  tiktok: { char_limit: "80", priority: "OUTCOME for the viewer + one receipt. No job titles.", cta: "One line pointing at the pinned/link if you have a lead magnet.", example_shape: "[Outcome you teach] · [receipt] · [artifact] below" },
  instagram: { char_limit: "150", priority: "Line 1: who it's for + outcome. Line 2: receipt. Line 3: CTA to the artifact.", cta: "Named artifact, not 'link in bio' ('the 5 pitches ↓').", example_shape: "3 lines, each under 30 chars, scannable" },
  linkedin: { char_limit: "220 headline", priority: "Outcome + who for + receipt beats job title. 'Helping X get Y · Z receipt' out-performs 'Founder at...'", cta: "Featured section carries the artifact; headline carries the positioning.", example_shape: "[Outcome] for [who] · [strongest receipt] · [current build]" },
  x: { char_limit: "160", priority: "Positioning + one receipt + what you post about. Personality allowed; vagueness not.", cta: "Pinned post is the CTA, bio just earns the profile click.", example_shape: "[What you do] · [receipt] · [content promise]" },
  youtube: { char_limit: "1000 (about)", priority: "First 100 chars do the work (search snippet). Outcome + cadence + receipt.", cta: "End of about + channel links.", example_shape: "Paragraph 1 = niche statement. Paragraph 2 = proof. Paragraph 3 = schedule + CTA" }
};

const BIO_HYPE = ["guru", "ninja", "rockstar", "visionary", "serial entrepreneur", "thought leader", "coach for coaches", "6-figure", "7-figure", "passive income"];

function auditBio(bio: string, platform?: string) {
  const issues: any[] = [];
  const p = platform && BIO_RULES[platform];
  if (p) {
    const lim = parseInt(p.char_limit);
    if (!isNaN(lim) && bio.length > lim) issues.push({ rule: "char_limit", detail: `${bio.length} chars vs ~${lim} for ${platform}. Cut to the strongest clause.` });
  }
  for (const w of BIO_HYPE) { if (bio.toLowerCase().includes(w)) { issues.push({ rule: "hype_title", detail: `"${w}" is a costume word. Replace with a receipt.` }); break; } }
  if (!/\d/.test(bio)) issues.push({ rule: "no_receipt", detail: "No number in the bio. The strongest bios carry one verifiable specific (years, results, count)." });
  if (/^(founder|ceo|coach|consultant|expert) /i.test(bio.trim())) issues.push({ rule: "title_first", detail: "Bio opens with YOUR title instead of THEIR outcome. Nobody follows a job title." });
  const outcomeWords = /help|teach|show|get you|so you|land|grow|close|build/i.test(bio);
  if (!outcomeWords) issues.push({ rule: "no_outcome", detail: "No outcome language detected. The reader should know what THEY get within the first line.", severity: "consider" });
  return {
    verdict: issues.filter(i => i.severity !== "consider").length === 0 ? "PASS" : "NEEDS WORK",
    char_count: bio.length,
    issues,
    platform_rules: p || "Pass a platform for limit checks (tiktok, instagram, linkedin, x, youtube)",
    rewrite_recipe: "WHO gets WHAT + your strongest RECEIPT + one named artifact CTA. In that order, in their language."
  };
}

// =====================================================
// CONTENT PILLARS
// =====================================================
const PILLAR_SYSTEM = {
  the_four_pillars: [
    { pillar: "receipts", share: "~30%", what: "Proof content: results, numbers, artifacts, before/after. Builds the why-you.", failure: "Skipping it because it feels like bragging. Receipts are the trust engine; everything else is decoration." },
    { pillar: "method", share: "~40%", what: "How-to content teaching YOUR way of getting the outcome. Builds authority and search/save traffic.", failure: "Teaching generic best practices instead of your method. Generic teaching grows views, not buyers." },
    { pillar: "story", share: "~20%", what: "The journey: mistakes, costs, turns. Builds the parasocial bond that converts followers to list.", failure: "Story with no lesson = diary. Every story lands on what it means for them." },
    { pillar: "conversion", share: "~10%", what: "Direct offer content: the lead magnet, the product, the service. Harvests what the other three planted.", failure: "Either zero (never asking) or excessive (every video sells). Both kill the account." }
  ],
  rules: ["Every piece belongs to exactly one pillar — hybrid content does neither job", "The mix is a portfolio: measure per-pillar, not per-post", "Conversion content only performs proportional to the receipts pillar behind it"]
};

// =====================================================
// PLATFORM STRATEGY
// =====================================================
const PLATFORM_ROLES: Record<string, any> = {
  tiktok: { role: "REACH — cold discovery. Highest stranger-reach per unit effort, lowest ownership.", conversion_path: "Bio artifact → email list. TikTok followers are rented; convert to owned fast.", cadence_floor: "3-5/week for algorithm liveness", watch_out: "Audience mismatch: check WHO actually follows you vs WHO you serve before optimizing further." },
  instagram: { role: "TRUST — the portfolio your DMs and brands check. Stories = warm audience, Reels = reach.", conversion_path: "Reels reach → story trust → DM or bio artifact.", cadence_floor: "3-4 reels/week + regular stories", watch_out: "Grid perfectionism. Volume of proof beats polish of grid." },
  linkedin: { role: "AUTHORITY + B2B pipeline. Where operators and companies check if you're real.", conversion_path: "Posts → profile → featured artifact → DM/email.", cadence_floor: "2-3/week", watch_out: "Engagement-bait 'agree?' content builds reach that never converts." },
  x: { role: "NETWORK — peers, builders, media. Deals and collabs start in replies.", conversion_path: "Replies to bigger accounts → profile → pinned artifact.", cadence_floor: "Daily presence beats scheduled bursts", watch_out: "Threads without receipts. X's tolerance for direct is high; its tolerance for vague is zero." },
  youtube: { role: "COMPOUNDING — search + suggested. Slowest start, only platform where old content keeps working.", conversion_path: "Search intent → watch time trust → description artifact.", cadence_floor: "1/week sustained beats 3/week for a month", watch_out: "Making platform-shaped content instead of search-shaped content." },
  newsletter: { role: "OWNED — the only audience you keep if every platform bans you tomorrow. The conversion destination for all of the above.", conversion_path: "This IS the destination. Monetizes via offers and sponsorships.", cadence_floor: "Weekly, same day, same promise", watch_out: "Treating it as an afterthought broadcast instead of the core asset." }
};

// =====================================================
// ANALYTICS INTERPRETATION
// =====================================================
const SIGNAL_READS: Record<string, any> = {
  views_high_followers_flat: { meaning: "Content entertains strangers but positioning doesn't give them a reason to stay.", fix: "Tighten the content promise in bio + recurring formats. Following is a subscription decision: what are they subscribing to?" },
  followers_high_engagement_low: { meaning: "Audience collected on old/viral content that doesn't match current positioning, or bought/mismatched audience.", fix: "Check follower demographics vs target WHO. Content for who you WANT, accept the decay of who you have." },
  saves_high_shares_low: { meaning: "Reference value without identity value. Useful but not tribal.", fix: "Add point-of-view content (contrarian, story) — people share what says something about THEM." },
  dms_high_sales_low: { meaning: "Trust exists but the offer path is broken or priced wrong.", fix: "Audit the artifact chain: bio → lead magnet → sequence → offer. Usually one link is missing, not the whole chain." },
  reach_stuck_engagement_high: { meaning: "Small loyal audience, algorithm not expanding distribution. Often a hook problem, not a content problem.", fix: "Rework hooks (first 2 seconds) before changing content strategy. Same content, sharper opens." }
};

// =====================================================
// MCP SERVER
// =====================================================
const server = new Server({ name: "personal-brand-mcp", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_positioning_framework",
      description: "The niche-statement formula (WHO x OUTCOME x HOW x RECEIPT) with the four checks, anti-patterns, the proof-inventory process, and the moat check. Positioning is upstream of every other brand decision.",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "audit_bio",
      description: "Audit a profile bio: character limits per platform, hype titles vs receipts, title-first openers, missing outcome language. Platforms: tiktok, instagram, linkedin, x, youtube. Returns PASS/NEEDS WORK with a rewrite recipe.",
      inputSchema: { type: "object", properties: { bio: { type: "string" }, platform: { type: "string", enum: Object.keys(BIO_RULES) } }, required: ["bio"] }
    },
    {
      name: "get_bio_rules",
      description: "Bio architecture per platform: what the first line must do, character priorities, CTA shape. Platforms: tiktok, instagram, linkedin, x, youtube.",
      inputSchema: { type: "object", properties: { platform: { type: "string", enum: Object.keys(BIO_RULES) } }, required: ["platform"] }
    },
    {
      name: "get_content_pillars",
      description: "The 4-pillar content system (receipts ~30%, method ~40%, story ~20%, conversion ~10%) with what each pillar does, its failure mode, and the portfolio rules.",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "get_platform_strategy",
      description: "The strategic role of each platform (tiktok=reach, instagram=trust, linkedin=authority, x=network, youtube=compounding, newsletter=owned) with conversion path, cadence floor, and the watch-out.",
      inputSchema: { type: "object", properties: { platform: { type: "string", enum: Object.keys(PLATFORM_ROLES), description: "Optional: one platform" } } }
    },
    {
      name: "interpret_growth_signal",
      description: "Interpret a growth pattern: views_high_followers_flat, followers_high_engagement_low, saves_high_shares_low, dms_high_sales_low, reach_stuck_engagement_high. Returns what it means and the fix order.",
      inputSchema: { type: "object", properties: { signal: { type: "string", enum: Object.keys(SIGNAL_READS) } }, required: ["signal"] }
    },
    {
      name: "get_full_pack",
      description: "The complete personal-brand library in one payload: positioning, bio rules, pillars, platform strategy, signal reads.",
      inputSchema: { type: "object", properties: {} }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const a = args as any;
  const wrap = (obj: any) => ({ content: [{ type: "text" as const, text: JSON.stringify({ ...obj, _meta: MCP_META }, null, 2) }] });

  if (name === "get_positioning_framework") return wrap(POSITIONING);
  if (name === "audit_bio") {
    if (!a.bio) return wrap({ error: "Provide the bio text as 'bio'." });
    return wrap(auditBio(a.bio, a.platform));
  }
  if (name === "get_bio_rules") {
    const r = BIO_RULES[a.platform];
    if (!r) return wrap({ error: "Unknown platform. See enum." });
    return wrap({ platform: a.platform, ...r });
  }
  if (name === "get_content_pillars") return wrap(PILLAR_SYSTEM);
  if (name === "get_platform_strategy") {
    if (a.platform) {
      const r = PLATFORM_ROLES[a.platform];
      if (!r) return wrap({ error: "Unknown platform. See enum." });
      return wrap({ platform: a.platform, ...r });
    }
    return wrap({ principle: "Every platform is either reach, trust, authority, network, compounding, or owned. Pick 2 + the newsletter; more is a hobby.", roles: PLATFORM_ROLES });
  }
  if (name === "interpret_growth_signal") {
    const s = SIGNAL_READS[a.signal];
    if (!s) return wrap({ error: "Unknown signal. See enum." });
    return wrap({ signal: a.signal, ...s });
  }
  if (name === "get_full_pack") {
    return wrap({
      pack: "Personal Brand MCP — Complete Library v1.0",
      author: "Elisabeth Hitz",
      modules: { positioning: POSITIONING, bio_rules: BIO_RULES, pillar_system: PILLAR_SYSTEM, platform_roles: PLATFORM_ROLES, signal_reads: SIGNAL_READS }
    });
  }
  return wrap({ error: "Unknown tool" });
});

const transport = new StdioServerTransport();
await server.connect(transport);
