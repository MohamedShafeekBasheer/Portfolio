---
title: "Three Microsoft 365 roadmap items SharePoint admins should notice"
date: 2026-11-21
summary: Default library labels for files already in SharePoint, SharePoint News cross-posted to Engage, and Python steps in Copilot Studio — what each means if you run a tenant.
description: "Default library labels, SharePoint News cross-posted to Engage, and Python in Copilot Studio: what each means for SharePoint admins."
tags: [SharePoint Online, Microsoft Purview, Copilot Studio, Governance]
sources:
  - https://www.microsoft.com/microsoft-365/roadmap?featureid=575283
  - https://www.microsoft.com/microsoft-365/roadmap?featureid=568074
  - https://www.microsoft.com/microsoft-365/roadmap?featureid=580866
---
Most roadmap updates are small. These three are worth a few minutes if SharePoint is part of your job.

## 1. Default library labels now apply to files already in the library

Purview already lets you set a **default sensitivity label on a SharePoint document library**, but until now it only applied to new or edited files. The roadmap item ([575283](https://www.microsoft.com/microsoft-365/roadmap?featureid=575283)) adds auto-labelling for **existing files** — data at rest — so they match the library's default.

**What to do:** before this reaches your tenant, find out which libraries already have a default label, and check that the label is what you actually want applied to everything in them. A label that only covered a handful of new files is about to cover all of them.

## 2. SharePoint News can be cross-posted to Viva Engage

News authors will be able to publish a SharePoint News post to an **Engage community or storyline** as well, keeping the full rendering and one shared conversation ([568074](https://www.microsoft.com/microsoft-365/roadmap?featureid=568074)).

**What to do:** tell your intranet owners and comms team. It changes where conversations about news happen, and it's worth agreeing which communities news should go to before people start choosing ad hoc.

## 3. Copilot Studio workflows can run Python

A new **Code node** lets makers run Python as a step in a Copilot Studio workflow, for transforms, calculations, regex and parsing that connectors and expressions can't handle ([580866](https://www.microsoft.com/microsoft-365/roadmap?featureid=580866)).

**What to do:** if you govern the Power Platform, include this in your maker guidance and data loss prevention review. Code inside a workflow is powerful, and it's also harder to review than a chain of connectors.

---

Roadmap dates move. Check each item's status for your tenant in the Microsoft 365 admin center's Message center before planning around it.
