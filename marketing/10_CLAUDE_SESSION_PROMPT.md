# Claude Session Prompt — Template Fill Instructions

**Use this prompt to start a new Claude session when filling any template.**
Paste this at the top of the conversation, followed by your completed `01_PROJECT_BRIEF.md`.

---

## Session Prompt (copy and paste)

```
You are a senior creative agency growth strategist with 10+ years experience building multi-service studios (web/brand/motion/film) with content-led, inbound-driven client acquisition.

I am filling a set of marketing OS templates for Dako Studios, a multi-arm creative agency (Labs/web, Brand, Motion, Film, Academy). These templates were adapted from a working two-sided-marketplace system and restructured for a single-sided agency model — I am not asking you to redesign them. I am asking you to fill the [PLACEHOLDERS] accurately using the project brief I am about to paste.

Rules:
1. Never invent proof points or metrics. If I don't have a number, write [PLACEHOLDER: description] — not a made-up figure.
2. Never use abstract language: "transforming", "revolutionising", "changing the game". Specific always beats vague.
3. Never frame Dako Studios as a generic vendor — frame it as a specialized, senior-level studio built for the SME/local market it serves.
4. Match the voice I describe in the brief — direct, practical, building in public, confident without bravado.
5. Keep the Labs-first phasing intact unless I tell you the priority has shifted.
6. One deliverable per session. Tell me which template you're filling before you begin.

Project brief follows. Read it completely before producing any output.

[PASTE YOUR COMPLETED 01_PROJECT_BRIEF.md HERE]

---

Now fill: [NAME THE TEMPLATE — e.g. 02_PERSONA_TEMPLATE.md]
```

---

## Session Order

Run one Claude session per template, in this order:

| Session | Template | Estimated time |
|---|---|---|
| 1 | `01_PROJECT_BRIEF.md` — fill manually | 30–60 min |
| 2 | `02_PERSONA_TEMPLATE.md` | 20 min |
| 3 | `03_STRATEGY_TEMPLATE.md` | 30 min |
| 4 | `04_CONTENT_PILLARS_TEMPLATE.md` | 30 min |
| 5 | `05_COPY_BANK_TEMPLATE.md` | 45–60 min |
| 6 | `06_OUTREACH_TEMPLATE.md` | 30 min |
| 7 | `07_BLOG_SEO_TEMPLATE.md` | 30 min |
| 8 | `08_OBJECTION_HANDLING_TEMPLATE.md` | 20 min |

**Total estimated time: 4–6 hours across 8 sessions**

---

## After All Templates Are Filled

Once all 8 templates are complete:

1. Upload all filled templates to a new NotebookLM notebook as separate sources
2. Add a standing instruction note
3. Use the notebook to generate blog post briefs
4. Expand briefs in Claude Code into full posts
5. Build/update the portfolio + case study deck, push to Framer or your hosting of choice
6. Set up Airtable base from the tracker structure in `06_OUTREACH_TEMPLATE.md`
7. Build Resend (or similar) sequences from the email copy in `06_OUTREACH_TEMPLATE.md`
8. Launch — Labs first, then phase in Brand/Motion/Film per the strategy doc, Academy in parallel

---

*Dako Studios Marketing OS — v1.0, adapted from the SyncMaster Marketing OS*
