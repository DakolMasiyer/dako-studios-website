# Dako Studios — Outreach System Template

**Feeds from:** `02_PERSONA_TEMPLATE.md` + `03_STRATEGY_TEMPLATE.md`
**Feeds into:** Airtable pipeline tracker, Resend email sequences

---

## System Overview

One outreach funnel shape applies to every persona: **Awareness → Lead → Proposal → Client → Referral.** Run it per persona group, phased by priority — SME/Business (Labs/Brand/Motion) is active now; Film is phased in once the Labs pipeline stabilizes; Academy runs on its own enrollment funnel in parallel.

| Track | Target | Goal | Primary channel | Phase |
|---|---|---|---|---|
| SME track | `[SME_PERSONA_NAME]` | Discovery call → proposal → client closed | Email / DM | Active now |
| Film track | `[FILM_PERSONA_NAME]` | Discovery call → proposal → project closed | LinkedIn → Email | Phase 3+ |
| Academy track | `[STUDENT_PERSONA_NAME]` | Content/site visit → enrolled | Site / Email | Parallel, always on |

---

## Track 1 — SME / Business Owner ([SME_PERSONA_NAME])

### Sequence Map

| Sequence | Trigger | Touches | Timeline | Goal |
|---|---|---|---|---|
| Cold outreach | Identified via `[SME_DISCOVERY_CHANNEL — e.g. no-website lead list, Run 1-15 pipeline]` | 3 messages | 7 days | Discovery call booked |
| Proposal | Discovery call attended | 1 proposal + 2 follow-ups | 7 days | Client closed |
| Re-engagement | No reply after cold message 3, or proposal lapses | 1x/month | Ongoing | Capture when timing is right |

---

### Cold Sequence — SME

**Sequence arc:**
Day 0: Who we are + why now → Day 3: Education + value hook → Day 7: Proof + call-booking CTA

---

#### SME-COLD-01 — Day 0

**Subject:** `[SME_EMAIL_SUBJECT_1]`
**Channel:** Email or DM
**Tone:** Warm, direct, no pitch

```
Hi [NAME],

[PERSONALISED_OPENER — 1 sentence. Reference something specific about their business — e.g. noticed they don't have a site, or their current site doesn't work on mobile.]

My name is [FOUNDER_NAME]. I run Dako Studios — [ONE_SENTENCE_DESCRIPTION].

Here's the short version of what we do:

[SME_VALUE_PROP — 2–3 sentences. What we build, how fast, what changes for their business.]

We're currently working with a small group of [SME_PERSONA_DESCRIPTION] and have a few spots open this month.

No commitment. Just a conversation.

[LOW_FRICTION_ASK — "Would it be worth 20 minutes?" or "Happy to send a few examples if useful."]

[FOUNDER_NAME]
Dako Studios · dako.studio
```

---

#### SME-COLD-02 — Day 3

**Subject:** `[SME_EMAIL_SUBJECT_2]`
**Channel:** Email
**Tone:** Educational, value-first

```
Hi [NAME],

[FOLLOW_UP_OPENER — reference Day 0 without pressure]

I wanted to share something useful whether or not we end up working together.

[EDUCATION_HOOK — 1 key insight about [TOPIC] that most SME owners don't know. Be specific.]

[EXPLANATION — 2–3 short paragraphs. Plain language. One idea per paragraph.]

This is the gap Dako Studios was built to close — for businesses that have the customers but not the digital presence to match.

If this resonates, booking a call takes 2 minutes: [CALENDAR_LINK]

[FOUNDER_NAME]
```

---

#### SME-COLD-03 — Day 7

**Subject:** `[SME_EMAIL_SUBJECT_3]`
**Channel:** Email
**Tone:** Proof-first, closing

```
Hi [NAME],

Last one from me on this.

[PROOF_POINT — most specific outcome you have. Name the result, not the effort.]

[WHAT_IT_TOOK — brief. Shows the process works.]

[IMPLICATION — for their business specifically.]

If you'd like a quick call to talk through what this could look like for you: [CALENDAR_LINK]

If the timing isn't right, no problem — I'll keep you on the list for updates.

[FOUNDER_NAME]
```

---

### Proposal Sequence — SME

**Trigger:** Discovery call attended
**Arc:** Proposal sent → check-in → final follow-up

---

#### SME-PROPOSAL-01 — Day 0 (Proposal Sent)

**Subject:** `[PROPOSAL_SUBJECT_1]`

```
Hi [NAME],

Great talking today.

Attached is a proposal based on what we discussed: [ONE_LINE_SCOPE_SUMMARY]

It covers:

[SCOPE_ITEM_1]
[SCOPE_ITEM_2]
[SCOPE_ITEM_3]

[TIMELINE — "This takes about X days from kickoff"]
[PRICE — or "pricing breakdown attached"]

Any questions, reply here.

[FOUNDER_NAME]
```

---

#### SME-PROPOSAL-02 — Day 3 (Check-in)

**Subject:** `[PROPOSAL_SUBJECT_2]`

```
Hi [NAME],

Quick check-in on the proposal I sent.

[WHAT_MIGHT_BE_UNCLEAR — offer to clarify scope or price]

[WHY THIS MATTERS — 1 sentence connecting the project to an outcome they care about]

Happy to hop on a quick call if easier.

[FOUNDER_NAME]
```

---

#### SME-PROPOSAL-03 — Day 7 (Final Follow-up)

**Subject:** `[PROPOSAL_SUBJECT_3]`

```
Hi [NAME],

Last note on this — I don't want to clutter your inbox.

[ONE_REASON_TO_MOVE_NOW — e.g. limited slots, seasonal relevance]

If you'd like to move forward: [BOOKING_OR_PAYMENT_LINK]

If the timing isn't right, I'll check back in a month.

[FOUNDER_NAME]
```

---

### Re-engagement — SME

**Trigger:** No reply after Cold-03, or proposal lapses without a decision
**Frequency:** 1x/month
**Subject:** `[REENGAGE_SUBJECT]`

```
Hi [NAME],

One update from Dako Studios this month:

[PROOF_POINT — most recent specific milestone or project]

[ONE_SENTENCE_RELEVANCE — why this is worth their attention now]

Still happy to put together a quote whenever the timing's right: [CALENDAR_LINK]

[FOUNDER_NAME]
```

---

## Track 2 — Film / Entertainment Client ([FILM_PERSONA_NAME])

### Sequence Map

| Sequence | Trigger | Touches | Timeline | Goal |
|---|---|---|---|---|
| Cold outreach | `[FILM_CONNECTION_TRIGGER — e.g. LinkedIn connection accepted]` | 3 messages | 7 days | Discovery call booked |
| Post-call | Call attended | 2 messages | 5 days | Project proposal sent / closed |

---

### Cold Sequence — Film

**Sequence arc:**
Day 0: Value open → Day 3: Proof + pain → Day 7: Low-friction CTA

---

#### FILM-COLD-01 — Day 0

**Subject / Message:** `[FILM_EMAIL_SUBJECT_1]`
**Channel:** LinkedIn DM
**Tone:** Peer-level, no pitch, reference-led

```
Hi [NAME],

[PERSONALISED_OPENER — reference their production or company content. 1 sentence.]

I'm [FOUNDER_NAME], founder of Dako Studios.

[ONE_LINE_WHAT_YOU_DO — from their perspective, not yours. Lead with their marketing/BTS content need.]

Worth connecting?

[FOUNDER_NAME]
```

---

#### FILM-COLD-02 — Day 3

**Subject / Message:** `[FILM_EMAIL_SUBJECT_2]`
**Channel:** LinkedIn DM or Email
**Tone:** Proof-led

```
Hi [NAME],

Following up from earlier.

[PROOF_STAT — most specific outcome that addresses their pain]

[ONE_SENTENCE_WHAT_THAT_MEANS_FOR_THEM]

Open to a 20-minute call to show you some examples?

[FOUNDER_NAME]
dako.studio
```

---

#### FILM-COLD-03 — Day 7

**Subject / Message:** `[FILM_EMAIL_SUBJECT_3]`
**Channel:** LinkedIn or Email
**Tone:** Final, no pressure

```
Hi [NAME],

Last note — I'll leave the conversation here.

[ONE_SPECIFIC_RELEVANCE — why Dako Studios is particularly useful for their upcoming production]

If the timing ever works: [CALENDAR_LINK]

[FOUNDER_NAME]
```

---

### Post-Call Sequence — Film

**Trigger:** Discovery call attended
**Arc:** Recap → proposal

---

#### FILM-CALL-01 — Day 1

**Subject:** `[CALL_FOLLOWUP_SUBJECT_1]`

```
Hi [NAME],

Good talking today.

One thing I wanted to follow up on: [SPECIFIC_POINT_FROM_CALL]

[NEXT_STEP_OR_RESOURCE]

[FOUNDER_NAME]
```

---

#### FILM-CALL-02 — Day 5

**Subject:** `[CALL_FOLLOWUP_SUBJECT_2]`

```
Hi [NAME],

[SHORT_CONTEXT — "following up from our call last week"]

Attached is a proposal for [PROJECT_SCOPE].

[WHAT_THEY_GET — specific]
[TIMELINE]
[PRICE]

[FOUNDER_NAME]
```

---

## Track 3 — Aspiring Creative ([STUDENT_PERSONA_NAME]) — Academy

This funnel is content-and-site driven rather than 1:1 outreach — students discover learn.dako.studio through content, then self-enroll. Keep a single nurture sequence for anyone who visits the site without enrolling.

#### ACADEMY-NURTURE-01

**Trigger:** Site visit, no enrollment
**Subject:** `[ACADEMY_NURTURE_SUBJECT]`

```
Hi [NAME],

[WHAT_THEY_GET_FROM_THE_BOOTCAMP — 1-2 sentences]

[PROOF — student outcome or testimonial]

Enroll here: [ENROLLMENT_LINK]

[FOUNDER_NAME]
```

---

## Airtable Pipeline Tracker Structure

### SME / Film Track Table

| Field | Type | Notes |
|---|---|---|
| Name | Text | Full name |
| Arm | Select | Labs / Brand / Motion / Film |
| Contact channel | Select | Email / LinkedIn / DM / WhatsApp |
| Discovery source | Select | `[DISCOVERY_CHANNEL]` options |
| Status | Select | Identified / Cold-01 sent / Cold-02 sent / Cold-03 sent / Call booked / Call done / Proposal sent / Client / Not interested |
| Cold-01 date | Date | |
| Cold-02 date | Date | |
| Cold-03 date | Date | |
| Call date | Date | |
| Proposal sent date | Date | |
| Client closed date | Date | |
| Notes | Long text | |

### Academy Table

| Field | Type | Notes |
|---|---|---|
| Name | Text | |
| Source | Select | Instagram / LinkedIn / referral / site |
| Status | Select | Visited site / Nurture sent / Enrolled / Graduated |
| Enrollment date | Date | |
| Notes | Long text | |

---

**Next file:** `08_BLOG_SEO_TEMPLATE.md`
