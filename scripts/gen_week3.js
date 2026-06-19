const fs = require('fs');
const path = require('path');

const week3 = `

### Saturday July 5 (1 post)

---

**POST 23 — Twitter/X · 9am WAT**
**Pillar:** Proof
**Format:** Thread, 6 tweets

\`\`\`
Tweet 1:
Two films. One launch window. Five days to #1 and #2 on Prime Video Nigeria. 🧵

Tweet 2:
The challenge — two separate PR agencies, two films, one shared release window.

Tweet 3:
The approach — one unified campaign theme across both, instead of two competing pushes.

Tweet 4:
Coordinated content, SEO, email, and paid — all pointed at the same audience signal.

Tweet 5:
The result — Kill Boro and A Father's Love hit #1 and #2 within 5 days of release.

Tweet 6:
This is what a coordinated film campaign looks like when reach and conversion are treated as the same problem.
— Dako Studios Film
\`\`\`

---

### Monday July 7 (2 posts)

---

**POST 24 — Instagram · 8pm WAT**
**Pillar:** Proof
**Format:** Carousel, 4 slides
**Asset:** Canva, stat breakdown

\`\`\`
Slide 1:
Numbers from First Features (Amazon Prime Nigeria)

Slide 2:
1M+ Meta reach
43% email open rate

Slide 3:
300% engagement growth
All films -> #1 Nigeria Top Movies chart

Slide 4:
Film marketing is about reaching the audience that converts to viewers. Not just impressions.
— Dako Studios Film
\`\`\`

---

**POST 25 — TikTok · 3pm WAT**
**Pillar:** BTS
**Format:** Screen record, 45s

\`\`\`
Hook: "Watch us map out a website before we ever open a design file."
Body: (Show Figma wireframe session live)
"We're blocking out the user journey.
Hero section -> Trust signals -> Services -> Clear CTA.
If this structure fails, the design fails.
We engineer the structure first."
Close: "That's how Dako Studios builds."
\`\`\`

---

### Tuesday July 8 (2 posts)

---

**POST 26 — Twitter/X · 9pm WAT**
**Pillar:** Education
**Format:** Thread, 5 tweets

\`\`\`
Tweet 1:
Before you put your website URL in your email signature, run this check. 🧵

Tweet 2:
1. Does it load in under 3 seconds?
If it doesn't, you've already lost half your visitors.

Tweet 3:
2. Does it work flawlessly on mobile?
70% of your traffic is on a phone.

Tweet 4:
3. Is there ONE clear CTA above the fold?
Don't make them scroll to know how to hire you.

Tweet 5:
4. Do you own the domain?
If you're on a free .wixsite link, you're signaling you aren't established yet.
Need a fix? → dako.studio
\`\`\`

---

**POST 27 — Instagram · 8pm WAT**
**Pillar:** Proof
**Format:** Carousel, 4 slides
**Asset:** Canva, Double Bill case study

\`\`\`
Slide 1:
Two films. One launch window.

Slide 2:
The Challenge: How do you market two major Prime Video releases simultaneously without them cannibalizing each other?

Slide 3:
The Approach: A unified digital campaign arc. Coordinated PR and paid strategies.

Slide 4:
The Result: #1 and #2 on Prime Video Nigeria within 5 days.
Reach the audience that converts.
— Dako Studios Film
\`\`\`

---

### Wednesday July 9 (2 posts)

---

**POST 28 — TikTok · 4pm WAT**
**Pillar:** Culture
**Format:** Talking head, 45s

\`\`\`
Hook: "What it means to build a creative studio in Abuja in 2026."
Body: "The talent is here. The clients are here. The infrastructure gap is closing fast.
We're building Dako Studios because Nigerian SMEs deserve world-class design that scales with them, without paying enterprise agency fees."
Close: "We build for this market because we're part of it."
\`\`\`

---

**POST 29 — Twitter/X · 9am WAT**
**Pillar:** Proof
**Format:** Single tweet

\`\`\`
Academy highlight: "I'd never touched Figma before. By Day 20, I built a full landing page from scratch." — Adaeze, Dako Studios Academy.
Real skills. Real projects.
\`\`\`

---

### Thursday July 10 (2 posts)

---

**POST 30 — Instagram · 8pm WAT**
**Pillar:** Culture
**Format:** Single graphic
**Asset:** Canva quote card

\`\`\`
"Professional creative work was never only for big budgets.
The gap isn't skill or ambition. It's access to a studio that works at your scale."
— Dako Studios
\`\`\`

---

**POST 31 — TikTok · 2pm WAT**
**Pillar:** BTS
**Format:** Reel / Screen record, 60s

\`\`\`
Hook: "What a student built in 20 days."
Body: (Walkthrough of Adaeze's Day 20 capstone project)
"This is Adaeze's final project. She started with zero design experience.
By Day 20, she submitted a fully responsive landing page prototype."
Close: "The bootcamp is live at learn.dako.studio."
\`\`\`

---

### Friday July 11 (1 post)

---

**POST 32 — Blog · dako.studio/blog**
**Pillar:** Proof
**Format:** Case study, 1000 words

\`\`\`
Title: How we ran the digital campaign for two simultaneous Prime Video releases

A deep dive into the Double Bill campaign for Natives Filmworks.
We cover the challenge of marketing Kill Boro and A Father's Love at the same time.
We break down the unified theme, the email strategy (43% open rate), and the paid approach that drove both films to the top 2 spots on the charts in under a week.
\`\`\`

---
`;

const fileContent = fs.readFileSync('marketing/05_CONTENT_CALENDAR_TEMPLATE.md', 'utf8');

let updatedContent = fileContent.replace(/## WEEK 3 — Jul 4–10[\s\S]*?(?=## WEEK 4)/, '## WEEK 3 — Jul 4–10\n**Theme:** Build Credibility — Film Proof + Adaeze Story\n**Goal:** Drop the big proof moments + introduce Academy via Adaeze\n' + week3 + '\n\n');

fs.writeFileSync('marketing/05_CONTENT_CALENDAR_TEMPLATE.md', updatedContent, 'utf8');
console.log("Updated Week 3");
