const fs = require('fs');
const path = require('path');

const week2 = `

### Saturday June 28 (1 post)

---

**POST 13 — Twitter/X · 9am WAT**
**Pillar:** Education
**Format:** Thread, 5 tweets

\`\`\`
Tweet 1:
Most website "handoffs" are a link and a password.
That's not a handoff — that's an exit. 🧵

Tweet 2:
A real handoff means you own the domain.
Not your developer. You.
If you stop paying them, your business doesn't disappear.

Tweet 3:
It means you can edit a price, swap a photo, update your hours — without calling anyone.
You shouldn't need an invoice to fix a typo.

Tweet 4:
It means there's documentation.
You should know how your digital storefront is built.

Tweet 5:
It means independence within a professionally designed structure.
That's the model we build on. Framer + client-editable CMS.
→ dako.studio
\`\`\`

---

### Monday June 30 (2 posts)

---

**POST 14 — Instagram · 8pm WAT**
**Pillar:** Education
**Format:** Carousel, 5 slides
**Asset:** Create in Canva — clean brand colours

\`\`\`
Slide 1:
Facebook page vs website — 4 structural differences

Slide 2:
01. Ownership
Facebook can change its algorithm tomorrow and kill your reach.
Your website is your own digital real estate.

Slide 3:
02. Searchability
Google doesn't rank Facebook pages for local searches.
If someone searches "lawyer in Abuja", your website ranks, your page doesn't.

Slide 4:
03. Trust
A custom domain (.com or .ng) signals you are established before a word is read.

Slide 5:
04. Analytics
A website tells you exactly where your leads drop off.
Facebook gives you vanity metrics.
→ dako.studio
\`\`\`

---

**POST 15 — TikTok · 3pm WAT**
**Pillar:** BTS
**Format:** Screen record, 45s

\`\`\`
Hook: "This is what a client-editable site actually looks like."
Body: (Screen record showing a Framer CMS interface)
"We're setting this up so the client can change their service prices without ever needing to call us again.
Most agencies build dependency into their relationship. We build independence."
Close: "Dako Studios. We build sites you own."
\`\`\`

---

### Tuesday July 1 (2 posts)

---

**POST 16 — Twitter/X · 9pm WAT**
**Pillar:** Proof
**Format:** Single tweet

\`\`\`
Da'anong Gyang is a DP with Amazon Prime credits.
We built him a portfolio site that makes sure the right people can verify that fast.
Result: More bookings. That's what a website is for.
\`\`\`

---

**POST 17 — Instagram · 8pm WAT**
**Pillar:** BTS
**Format:** Reel

\`\`\`
Hook: "Running a 5-arm studio as a solo founder."
Body: (Quick cuts: Figma wireframe -> Canva brand deck -> Academy capstone review)
"Today: 2 discovery calls for Labs, 1 brand deck revision, and reviewing Academy Day 20 capstones. No team yet. Just a system that holds."
Close: "Building in public. Follow along."
\`\`\`

---

### Wednesday July 2 (2 posts)

---

**POST 18 — TikTok · 2pm WAT**
**Pillar:** Education
**Format:** Talking head, 45s

\`\`\`
Hook: "Why your Wix site isn't converting — and it's not your fault."
Body: "Your Wix site looks fine. But it's missing UX thinking.
A template gives you colours. It doesn't tell a visitor where to look first, or where the CTA should live.
A site that looks good and a site that works are two different builds."
Close: "Fix the structure. → dako.studio"
\`\`\`

---

**POST 19 — Twitter/X · 9am WAT**
**Pillar:** Culture
**Format:** Single tweet

\`\`\`
Professional creative work was never only for big budgets.
The gap isn't skill. It's access to a studio that works at your scale.
\`\`\`

---

### Thursday July 3 (2 posts)

---

**POST 20 — Instagram · 8pm WAT**
**Pillar:** Education
**Format:** Carousel, 4 slides
**Asset:** Canva, wireframe sketches

\`\`\`
Slide 1:
What UX thinking looks like before design begins.

Slide 2:
Most agencies go straight to fonts and colours.
We start here: (Show low-fidelity wireframe)

Slide 3:
We map where the visitor's eye goes, what they need to see to trust you, and where the CTA lives.

Slide 4:
Design without this step is decoration, not strategy.
→ dako.studio
\`\`\`

---

**POST 21 — TikTok · 4pm WAT**
**Pillar:** Proof
**Format:** Talking head, 45s

\`\`\`
Hook: "We got two films to #1 and #2 on Prime Video Nigeria in 5 days."
Body: "Here is the campaign structure.
One unified theme across both films.
Coordinated PR, SEO, and paid strategies pointed at the same audience signal.
Film marketing isn't about impressions. It's about reaching the audience that converts."
Close: "Dako Studios Film. dako.studio"
\`\`\`

---

### Friday July 4 (1 post)

---

**POST 22 — Blog · dako.studio/blog**
**Pillar:** Education
**Format:** Article, 800 words

\`\`\`
Title: What a client-editable website actually means — and why it matters

Most web agencies build dependency into their projects. You need them to make a simple text change.
At Dako Studios, we hand over a Framer CMS that lets you:
- Update pricing
- Swap portfolio images
- Change business hours
All without writing a line of code or paying a retainer.
Independence is built into the deliverable.
\`\`\`

---
`;

const fileContent = fs.readFileSync('marketing/05_CONTENT_CALENDAR_TEMPLATE.md', 'utf8');

// Replace the weekly tables with the full generated text
let updatedContent = fileContent.replace(/## WEEK 2 — Jun 27–Jul 3[\s\S]*?(?=## WEEK 3)/, '## WEEK 2 — Jun 27–Jul 3\n**Theme:** Educate Femi — The Website Problem in Depth\n**Goal:** Establish Dako Studios as the trusted educator before the vendor\n' + week2 + '\n\n');

fs.writeFileSync('marketing/05_CONTENT_CALENDAR_TEMPLATE.md', updatedContent, 'utf8');
console.log("Updated Week 2");
