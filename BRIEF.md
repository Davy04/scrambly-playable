# Simula Playable Game Developer Take-Home

Original assessment text, saved for reference. Role: Game Developer at Simula Ad (via Amplify).
Time limit: 4 hours. Deadline: 1 day from receipt.

## Overview

Simula builds playable ads that live inside consumer AI platforms. For this take-home, build one short web playable for Scrambly that gives players a reason to explore the product.

We want to see how you turn an advertiser brief into a focused, enjoyable experience, and how you improve your own work after feedback. You choose the concept, mechanic, controls, visual style, tools, and whether to use 2D, 3D, or both.

Your challenge: Create one polished playable that connects fun gameplay and progress to Scrambly, then ends with a clear invitation to explore it.

## About Scrambly

Scrambly is a rewards platform where people discover mobile games and apps, complete eligible activities, and redeem rewards.

The product idea is simple:

1. Discover games and apps.
2. Play and progress through eligible activities.
3. Redeem the rewards collected.

Audience: Adults who enjoy casual mobile games and are curious about rewards for discovering and playing them.

Goal: Make the connection between play, progress, and Scrambly easy to understand.

CTA: End with a clearly labeled button that invites players to explore Scrambly. The click is simulated only.

Keep the product promise accurate. Any balance shown is a demo, not actual earnings. Avoid guaranteed-income or real-payout claims. Exact reward amounts and withdrawal rules are not needed.

## Visual direction

Aim for a warm, expressive, approachable treatment. The supplied fox, rounded forms, and orange-purple contrast are a starting point, not a required layout or official brand standard.

| Orange | Purple | Deep ink | Warm white |
|--------|--------|----------|------------|
| #F58324 | #7845D8 | #201338 | #FFF6E8 |

Scrambly reference kit: supplied with the assessment.

## Stage 1 — Build one playable

Choose an idea you can finish well within the time box. A familiar mechanic with a thoughtful advertiser connection is a strong answer; a second concept or variation is not required.

Your playable should:

- Make the interaction understandable and responsive.
- Have purposeful progression and a clear ending or next step.
- Connect the experience meaningfully to Scrambly.
- Work with touch and mouse on mobile-sized screens.
- Include a review-friendly restart.

You may use AI tools, libraries, templates, reusable code, and existing assets. In your project note, identify what you used, what you contributed, and one decision, correction, or rejected output that improved the result. You should understand the implementation and be able to modify it.

At six hours, submit the current version and clearly note anything unfinished or untested.

## Technical requirements

- **Production ZIP:** Put index.html at the ZIP root. Include the complete runnable build, readable source, libraries, fonts, assets, and concise run instructions.
- **Size:** The production ZIP must be no larger than 5,000,000 bytes (5 MB).
- **Runtime:** Run from a simple static HTTP server with no external requests, login, backend, or API keys. Build-time tools may use online services.
- **Layout:** Support touch and mouse. Test portrait at 320 x 568 and 390 x 844 CSS pixels, or landscape at 568 x 320 and 844 x 390. Adapt to the other orientation or show a clear rotate prompt. Prevent page scrolling from competing with gameplay.
- **CTA:** On an explicit click, show a local confirmation such as "CTA clicked — demo only" and log the click in the console. Do not navigate away.
- **Visibility:** Pause gameplay and clocks while the page is hidden; resume without time jumps. If you use audio, start it after interaction, provide mute, and silence it while hidden.
- **Reliability:** Handle resize, interrupted input, and the outcomes your design uses. Restart must reset cleanly without duplicate timers, listeners, or effects.
- **Handoff:** Include build/run instructions, tested browsers and devices, whether each was real or emulated, known limitations, and untested behavior.

Only apply conditional requirements your design uses: no audio means no mute control; no timer means no timer-expiry case.

## Deliverables

1. **Production ZIP** — The complete runnable build and readable source, with index.html at the ZIP root. Include concise run instructions.
2. **Full production-process screen recording** — Record the entire process from interpreting the brief through the final build. We especially want to see how you use AI: your tools, prompts, iterations, accepted and rejected outputs, corrections, and where you applied your own judgment.
3. **5-minute game walkthrough** — Demonstrate the core interaction, progression or ending, CTA, restart, and one important edge case. Talk through your key decisions, advertiser connection, time spent, tools and reused work, testing, limitations, and the most important changes you made.

## Stage 2 — Respond to feedback (if invited)

We may send one or two focused changes based on your playable. Spend no more than 2 hours and submit within 3 calendar days.

- Interpret the requested outcome and choose how to solve it.
- Keep the work within your existing playable; a new game or engine change is out of scope.
- Preserve working behavior and repeat relevant checks.
- Keep Stage 1 unchanged and add the revision as a new version or Git tag.
- Submit the updated ZIP and source, a short change log, repeated checks, known issues, and a screen recording of the changed behavior. In the recording, show how you used AI during the revision, including the prompts or workflow, what you accepted or rejected, and what you changed yourself.
- Ask your Simula contact if the request is unclear, contradictory, or too large for the time box.

## What we're looking for

| Weight | Criterion |
|--------|-----------|
| 30% | **Concept & advertiser connection:** A considered idea, a reason to play, and a meaningful connection to Scrambly. |
| 25% | **Experience, clarity & feel:** Understandable interaction, coherent visuals, responsive feedback, and complete scope. |
| 25% | **Technical execution:** A reliable build within budget, practical mobile behavior, readable source, and credible testing. |
| 20% | **Process, tools & autonomy:** Strong scope decisions, productive tool use, implementation understanding, and clear communication. |

Stage 2 is reviewed separately against the written request: understanding, quality of the change, preservation of behavior, prioritization, and communication. Extra features are not rewarded.

## Before you submit

- Production ZIP opens, has index.html at the root, and is within 5 MB.
- The ZIP includes readable source, run instructions, and asset/tool credits.
- Input, layout, CTA, restart, visibility, and relevant edge cases were checked.
- The full production-process recording is accessible and shows how AI was used.
- The 5-minute walkthrough covers decisions, time spent, tools, testing, limitations, and changes.
- Both Stage 1 and Stage 2 recordings show how AI was used and how its outputs were evaluated or improved.
- For Stage 2, original and revised versions are clearly labeled.

Tips: read the instructions carefully; focus on code quality, testing, and documentation; if you have questions, reply to the email.
