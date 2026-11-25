---
title: "Lessons from a SharePoint oversharing incident"
slug: lessons-from-a-sharepoint-oversharing-incident
date: 2026-12-09
summary: A partner company could reach a client's internal files in SharePoint and OneDrive. How we found the full extent, removed every unauthorised share within 48 hours without breaking the business, and stopped it happening again.
description: "How a SharePoint and OneDrive oversharing incident was audited, every unauthorised share removed within 48 hours, and governance tightened."
tags: [Security, SharePoint Online, Governance, Case study]
---
I led a Microsoft 365 security audit for a client after a live incident. An external sharing setting in SharePoint Online had been left too open, and **internal documents were reachable by users at a partner organisation**. The exposure ran across several site collections.

Nobody knew exactly how far it went. The first job was to find out, quickly, and stop it.

## Step 1: find the full extent

Using PowerShell and the Microsoft 365 admin center, we audited the whole tenant and listed:

- every **externally shared link**,
- every **guest account**,
- every **anonymous (Anyone) link**,

across SharePoint and OneDrive. Until you have that list, you're guessing.

## Step 2: revoke in a controlled order

The tempting fix is to switch external sharing off everywhere at once. That also breaks the legitimate sharing the business depends on, such as suppliers and partners mid-project.

So we revoked access **in a controlled order**: the unauthorised and sensitive exposure first, then the rest, checking business-critical sharing with its owners before touching it.

## Step 3: fix the cause

- Reset sharing policy at **both tenant and site-collection level**, so only sites that need external sharing have it.
- Added **Conditional Access** rules for guest access.
- Added **monitoring alerts** so a drift back towards over-sharing is noticed early.

## The result

- **100% of unauthorised external access removed within 48 hours.**
- Sharing policy tightened and enforced with Conditional Access.
- An incident report delivered to stakeholders.
- No recurrence since the fix.

## The lesson

Over-sharing builds up quietly. Each link is created for a good reason by someone doing their job. Nobody sees the total until it matters.

A **regular sharing review**, monthly or quarterly, costs far less than an incident. Start with these questions:

1. Which sites allow external sharing, and do they still need it?
2. Which Anyone links exist, and how old are they?
3. Which guests haven't signed in for 90 days?

The [case study](/work/sharepoint-external-sharing-breach/) has more detail.

<figure class="noteCard"><img src="/img/notes/lessons-from-a-sharepoint-oversharing-incident.jpg" width="720" height="900" loading="lazy" alt="Summary card: Lessons from a SharePoint oversharing incident"><figcaption>The one-page summary card for this note.</figcaption></figure>
