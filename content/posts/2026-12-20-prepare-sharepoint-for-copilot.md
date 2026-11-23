---
title: "Get ready for Copilot by fixing sharing first"
slug: prepare-sharepoint-for-copilot
date: 2026-12-20
summary: Microsoft 365 Copilot only shows people what they already have access to. That's safe, but it also makes over-shared files easy to find. Three checks to do in SharePoint before rolling Copilot out.
description: "Copilot respects SharePoint permissions, so over-shared files become easy to find. Three checks to fix sharing before you roll out Microsoft 365 Copilot."
tags: [Copilot, SharePoint Online, Security, Governance]
---
A common worry about Microsoft 365 Copilot is that it will show people things they shouldn't see. It won't. Copilot only uses content **the person already has access to**.

That's exactly why it needs preparation.

## The real risk: over-sharing becomes visible

In most tenants, some files are shared more widely than anyone intended: an HR spreadsheet in a site open to the whole company, a salary file shared with a link to "people in your organisation", a confidential project in a public team.

Until now, those files were safe in practice because **nobody knew where to look**. With Copilot, someone asks *"what are the salary bands for my role?"* and the answer comes from a file they always could have opened, but never would have found.

Copilot doesn't create the problem. It removes the obscurity that was hiding it.

## Three checks before rollout

**1. Review sites with broad access.**
Look for sites shared with **"Everyone"** or **"Everyone except external users"**, and **public** Microsoft 365 groups and teams. These give access to the whole organisation. For each, ask: does everyone really need this? If not, make the team private or remove the broad group.

**2. Check sharing links.**
Find links shared with **people in your organisation** and **Anyone** on sensitive sites. PowerShell or your admin reports can list them. Remove the ones that are no longer needed, and change the **default link type** to *Specific people* (see [The SharePoint sharing links, explained](/notes/sharepoint-sharing-links-explained/)).

**3. Label what's confidential.**
Apply **Microsoft Purview sensitivity labels** to confidential content, and to sites that hold it. Labels can restrict who can open a file and help Copilot handle labelled content correctly.

## Tools that help

If your organisation has **SharePoint Advanced Management**, its **data access governance reports** show sites with broad sharing and lots of sharing links, and **restricted access** options can lock down sensitive sites while you clean up. Check what your licences include.

## Start with the sensitive areas

You don't need to fix every site before rollout. Start with the places where over-sharing would hurt most: **HR, finance, legal and leadership**. Fix those, roll Copilot out to a pilot group, and keep reviewing.

The work is the same work good governance always needed. Copilot just gives it a deadline.

<figure class="noteCard"><img src="/img/notes/prepare-sharepoint-for-copilot.jpg" width="720" height="900" loading="lazy" alt="Summary card: Get ready for Copilot by fixing sharing first"><figcaption>The one-page summary card for this note.</figcaption></figure>
