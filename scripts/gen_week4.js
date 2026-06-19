const fs = require('fs');
const path = require('path');

const week4 = `

### Saturday July 12 (1 post)

---

**POST 33 — Twitter/X · 9am WAT**
**Pillar:** Education
**Format:** Thread, 5 tweets

\`\`\`
Tweet 1:
The real reason Nigerian SME websites don't generate leads. 🧵

Tweet 2:
It's not the budget. It's the build process.
Most are built without a UX brief.

Tweet 3:
They have no conversion architecture.
A pretty homepage doesn't tell the visitor what to do next.

Tweet 4:
And there's no post-launch ownership.
If you can't edit it, it rots.

Tweet 5:
Start with the user journey. Build it on a platform you can control.
That's the Dako Studios model.
\`\`\`

---

### Monday July 14 (2 posts)

---

**POST 34 — Instagram · 8pm WAT**
**Pillar:** BTS
**Format:** Carousel, 4 slides
**Asset:** Canva, project lifecycle

\`\`\`
Slide 1:
A Labs build — from brief to handoff.

Slide 2:
Step 1: The Brief & UX Map
We don't touch colors until we know exactly who we are talking to.

Slide 3:
Step 2: The Framer Build
Engineering the site to be blazing fast and responsive.

Slide 4:
Step 3: The Handoff
We hand over the keys. You get an editable CMS and full domain ownership.
→ dako.studio
\`\`\`

---

**POST 35 — TikTok · 3pm WAT**
**Pillar:** Education
**Format:** Talking head, 45s

\`\`\`
Hook: "What actually happens in a discovery call with a web designer."
Body: "If they immediately ask you what colors you like, hang up.
A real discovery call is about your business.
Who is your best customer? What is the biggest objection they have?
We figure out the business problem before we design the digital solution."
Close: "Book a real discovery call. → dako.studio"
\`\`\`

---

### Tuesday July 15 (2 posts)

---

**POST 36 — Twitter/X · 9pm WAT**
**Pillar:** Culture
**Format:** Single tweet

\`\`\`
One relationship. Multiple capabilities.
Web, Brand, Motion, Film, Academy.
That's the Dako Studios model.
\`\`\`

---

**POST 37 — Instagram · 8pm WAT**
**Pillar:** Education
**Format:** Carousel, 4 slides
**Asset:** Canva

\`\`\`
Slide 1:
What Dako Studios Labs actually delivers.

Slide 2:
We deliver a website that loads under 3 seconds.

Slide 3:
We deliver an architecture engineered for your specific customer.

Slide 4:
We deliver full ownership. No retainers. No hostage domains.
→ dako.studio
\`\`\`

---

### Wednesday July 16 (2 posts)

---

**POST 38 — TikTok · 4pm WAT**
**Pillar:** BTS
**Format:** Screen record, 45s

\`\`\`
Hook: "Live look at a Framer build in progress."
Body: (Screen recording of Framer interface)
"We are adding subtle scroll animations to keep the user engaged without sacrificing performance.
This is where the magic happens—balancing aesthetics with speed."
Close: "Follow for more behind the scenes."
\`\`\`

---

**POST 39 — Twitter/X · 9am WAT**
**Pillar:** Proof
**Format:** Single tweet

\`\`\`
First Dako Studios Labs client site just went live.
Built in 21 days. Fully editable by the client.
Zero developer retainer needed.
\`\`\`

---

### Thursday July 17 (2 posts)

---

**POST 40 — Instagram · 8pm WAT**
**Pillar:** Culture
**Format:** Carousel, 4 slides
**Asset:** Canva, ecosystem map

\`\`\`
Slide 1:
The creative ecosystem we are proud to be part of.

Slide 2:
Nigerian Film — Elevating Nollywood marketing with data and design.

Slide 3:
African Tech — Building platforms for FoodTech and SaaS innovators.

Slide 4:
We build for this market because we're part of it.
— Dako Studios
\`\`\`

---

**POST 41 — TikTok · 2pm WAT**
**Pillar:** Education
**Format:** Talking head, 45s

\`\`\`
Hook: "3 questions to ask before hiring a web designer."
Body: "1. Do I own the domain and hosting?
2. Can I edit text and images myself after launch?
3. What is your UX process before design starts?
If they can't answer these, walk away."
Close: "Hire a studio that gives you ownership. → dako.studio"
\`\`\`

---

### Friday July 18 (1 post)

---

**POST 42 — Blog · dako.studio/blog**
**Pillar:** Education
**Format:** Article, 800 words

\`\`\`
Title: What to expect from a 21-day website sprint

A plain-English guide to our Labs process.
Week 1: Strategy and UX Wireframes.
Week 2: Design and Framer Build.
Week 3: Revisions, CMS Setup, and Handoff.
No endless scope creep. Just an engineered solution delivered in 3 weeks.
\`\`\`

---
`;

const fileContent = fs.readFileSync('marketing/05_CONTENT_CALENDAR_TEMPLATE.md', 'utf8');

let updatedContent = fileContent.replace(/## WEEK 4 — Jul 11–17[\s\S]*?(?=## MONTH 1 TOTALS)/, '## WEEK 4 — Jul 11–17\n**Theme:** Deepen Trust — Process + Academy\n**Goal:** Show the studio\'s thinking layer; warm the Academy funnel\n' + week4 + '\n\n');

fs.writeFileSync('marketing/05_CONTENT_CALENDAR_TEMPLATE.md', updatedContent, 'utf8');
console.log("Updated Week 4");
