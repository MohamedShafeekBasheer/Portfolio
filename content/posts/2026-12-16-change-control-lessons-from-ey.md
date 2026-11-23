---
title: "What change control at EY taught me about speed"
slug: change-control-lessons-from-ey
date: 2026-12-16
summary: Formal change requests, scheduled releases and documentation felt slow at first. They are also why we delivered 10+ apps and 50+ workflows with zero compliance breaches. Good process is what lets you keep going fast.
description: "Lessons from formal change control at EY GDS: how change requests, scheduled releases and documentation helped ship 10+ Power Apps safely."
tags: [Power Platform, Career, Governance]
---
At EY Global Delivery Services I led a **Risk Management module** that used **Microsoft Copilot** for AI-assisted release analysis and approvals, and built **10+ Power Apps** with **50+ Power Automate workflows**.

The technical work was interesting. What changed how I work was the **process** around it.

## What it looked like

In a large, regulated organisation you don't just publish an app when it's ready:

- every change has a **formal change request**: what's changing, why, the risk and how to roll it back;
- releases go out on a **schedule**, not whenever a developer finishes;
- **documentation** is part of the work, not something done later;
- **UAT** (user acceptance testing) with the people who'll use it comes before production.

Coming from smaller teams, this felt slow at first.

## Why it isn't slow

Over time I saw what it bought us:

- **Fewer surprises in production.** Writing down the risk and the rollback forces you to think about them before you need them.
- **No "who changed this?"** Every change has a record, a reason and an approver.
- **Confidence to keep shipping.** When releases are predictable, nobody is afraid of the next one.
- **Zero compliance breaches** across everything we delivered.

Moving fast without process feels quick for a few months. Then something breaks, nobody knows what changed, and everything slows down while you find out.

## What I carry into smaller teams

You don't need EY's full process in a team of one or five. But a lightweight version pays off everywhere:

1. **A short change note** for anything that touches production: what, why, and how to undo it.
2. **A test environment** for Power Platform (a separate environment, with solutions moved between them) instead of building in production.
3. **Release on a known day** where possible, and tell users what changed.
4. **Write the documentation while you build.** It's quicker than doing it later from memory.

Good process isn't the opposite of speed. It's what lets you keep going fast without breaking things.

<figure class="noteCard"><img src="/img/notes/change-control-lessons-from-ey.jpg" width="720" height="900" loading="lazy" alt="Summary card: What change control at EY taught me about speed"><figcaption>The one-page summary card for this note.</figcaption></figure>
