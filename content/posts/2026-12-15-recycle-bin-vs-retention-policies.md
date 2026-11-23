---
title: "Deleted is not the same as gone: recycle bin vs retention"
slug: recycle-bin-vs-retention-policies
date: 2026-12-15
summary: The SharePoint recycle bin keeps deleted files for 93 days, then they're gone. Retention policies keep content for as long as you need, even if someone deletes it. Don't confuse the two.
description: "The SharePoint recycle bin keeps files 93 days; Microsoft Purview retention keeps them for years. How each works and when you need retention."
tags: [Microsoft Purview, SharePoint Online, Compliance, Admins]
---
"It's fine, it's in the recycle bin" is true for a while. It stops being true after 93 days. If your organisation has to keep records for years, the recycle bin is not the tool for it.

## How the recycle bin works

When someone deletes a file in SharePoint:

1. It goes to the **site recycle bin** (first stage). The person who deleted it, or a site owner, can restore it.
2. If it's deleted from there, it moves to the **second-stage recycle bin**, which only site collection admins can see.
3. **93 days after the original deletion**, it's removed permanently, whichever stage it's in.

The recycle bin is for **"oops"**: someone deleted the wrong file last week.

## What retention policies do

**Microsoft Purview retention policies** keep content for a period you choose, for example seven years, **even if someone deletes it**.

When a retention policy applies to a site and someone deletes or edits a file:

- the user sees it disappear as normal;
- SharePoint keeps a copy in a hidden **Preservation Hold library** in that site until the retention period ends;
- compliance staff can find it with **eDiscovery** or content search.

Retention is for **"we have to keep this for seven years"**: legal, finance, HR and audit requirements.

## Recycle bin vs retention

| | Recycle bin | Retention policy |
|---|---|---|
| Purpose | Undo mistakes | Meet legal and audit rules |
| How long | 93 days | As long as you set |
| Who restores | Users and site owners | Compliance or IT, via eDiscovery |
| Set up by | Built in | An admin, in Microsoft Purview |

## Where to start

1. Ask legal, finance and HR how long they must keep which records. Get the answer in writing.
2. In the **Microsoft Purview portal**, create a retention policy for the sites that hold those records, for the period they need.
3. Start small: one policy for finance sites, for example. Test it, then extend.

Retention policies can also **delete** content when the period ends. Agree that part with the business before switching it on; deleting is permanent.

## One caution

Retention keeps copies, which uses storage. A site under a retention policy will grow as people edit and delete. That's expected; plan for it rather than being surprised by it.

<figure class="noteCard"><img src="/img/notes/recycle-bin-vs-retention-policies.jpg" width="720" height="900" loading="lazy" alt="Summary card: Deleted is not the same as gone: recycle bin vs retention"><figcaption>The one-page summary card for this note.</figcaption></figure>
