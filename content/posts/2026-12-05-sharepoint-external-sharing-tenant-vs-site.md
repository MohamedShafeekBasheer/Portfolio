---
title: "External sharing in SharePoint: tenant vs site"
slug: sharepoint-external-sharing-tenant-vs-site
date: 2026-12-05
summary: External sharing has two levels in SharePoint. The tenant setting is the ceiling; each site can match it or be stricter, never more open. How to set both sensibly, and a five-minute check worth doing today.
description: "How SharePoint external sharing works at tenant and site level, the four sharing levels, a sensible setup, and a five-minute check for Anyone links."
tags: [SharePoint Online, Security, Governance, Admins]
---
If you're a SharePoint or Microsoft 365 admin, external sharing is one of the settings worth understanding properly. It has **two levels**, and the way they fit together explains most "why can't I share this?" and "how did this get outside?" questions.

## The four sharing levels

From most open to most closed:

1. **Anyone**: links that work without signing in.
2. **New and existing guests**: people outside the company can be invited; they sign in or use a one-time code.
3. **Existing guests**: only guests already in your directory.
4. **Only people in your organisation**: no external sharing at all.

## Level one: the tenant

In the **SharePoint admin center › Policies › Sharing**, the setting for SharePoint is the **most open any site can be**. Think of it as the ceiling. OneDrive has its own setting on the same page, and it can't be more open than SharePoint.

## Level two: each site

In **Sites › Active sites**, select a site, then **Settings › External file sharing**. Each site can be **the same as the tenant or stricter, never more open**.

So if the tenant allows *New and existing guests*, no site can use *Anyone* links, whatever its owner wants.

## A sensible setup

- Set the **tenant** to what your **most open legitimate site** needs. For many organisations that's *New and existing guests*, not *Anyone*.
- Set **most sites** to *Only people in your organisation* or *Existing guests*.
- Open up only the sites that really work with outsiders, such as a supplier portal or a project site with a partner.
- Set the default link type to **Specific people**, and add **expiry** for guest access and Anyone links if you allow them.

This way, an over-shared link is limited to the few sites designed for external work.

## The five-minute check

In **Active sites**, add the **External sharing** column to the view and sort by it. Look at which sites allow *Anyone*. It's often a surprise: a site created for a one-off event years ago, or a department site where someone changed the setting "temporarily".

For each one, ask the owner whether it still needs to be that open. Most don't.

If you want to go further, PnP PowerShell's `Get-PnPTenantSite` returns each site's `SharingCapability`, which makes a regular report easy.

<figure class="noteCard"><img src="/img/notes/sharepoint-external-sharing-tenant-vs-site.jpg" width="720" height="900" loading="lazy" alt="Summary card: External sharing in SharePoint: tenant vs site"><figcaption>The one-page summary card for this note.</figcaption></figure>
