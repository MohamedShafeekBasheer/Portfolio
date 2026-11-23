---
title: "Auditing SharePoint permissions with PowerShell"
slug: sharepoint-permission-audit-with-powershell
date: 2026-12-19
summary: For five companies on one Microsoft 365 tenant, "who has access to what?" took days to answer. A PowerShell permission audit turned it into something you run, not a project you dread. The approach, and a small script to start with.
description: "How a PowerShell and CSOM permission audit made 'who has access to what?' answerable across five companies, plus a PnP PowerShell starter script."
tags: [PnP PowerShell, SharePoint Online, Governance, Case study]
---
At AQS-PEPSI, five group companies share one Microsoft 365 tenant. "Who has access to what?" was a question nobody could answer quickly. Every audit request meant clicking through sites by hand.

So I built a **PowerShell and CSOM permission audit framework**, and alongside it, **Conditional Access** and **DLP** baselines for the tenant.

## What the audit does

It walks the sites and reports, for each one:

- who has access, and through which group;
- where **inheritance is broken**: libraries, folders and files with their own permissions;
- sharing links and external users.

The output is a report people can filter and compare over time. The first run shows the mess. Later runs show what changed.

## The point isn't the script

Any one-off audit is out of date the day after. What matters is that a permission review becomes **something you run regularly**, not a project. When a department head asks "who can see our folder?", the answer takes minutes.

## A starter script

You don't need a full framework to begin. This PnP PowerShell snippet lists the lists and libraries in a site that have **unique permissions**, which is usually the first thing an audit looks for.

```powershell
# Needs PowerShell 7, PnP.PowerShell, and your own Entra ID app registration
$siteUrl  = "https://contoso.sharepoint.com/sites/finance"
$clientId = "00000000-0000-0000-0000-000000000000"   # your app's client ID

Connect-PnPOnline -Url $siteUrl -ClientId $clientId -Interactive

Get-PnPList -Includes HasUniqueRoleAssignments |
  Where-Object { -not $_.Hidden -and $_.HasUniqueRoleAssignments } |
  Select-Object Title, ItemCount, DefaultViewUrl |
  Export-Csv ".\unique-permissions.csv" -NoTypeInformation
```

Run it on a few important sites and open the CSV. Each row is a library or list that doesn't follow the site's permissions. Ask the owner whether it still needs to be different.

If you haven't used PnP PowerShell before, [Your first SharePoint admin report](/notes/first-sharepoint-admin-report-pnp-powershell/) explains the sign-in setup.

## Where to go next

- Add **site groups and their members** (`Get-PnPGroup`, `Get-PnPGroupMember`).
- Loop over **all sites** from the tenant admin URL with `Get-PnPTenantSite`.
- Check **folders and items** with unique permissions in key libraries. This is slower on big libraries, so start with the sensitive ones.
- **Schedule it** and keep each run, so you can see changes over time.

Test any script on a few sites first, and run it with an account that has only the rights it needs.

<figure class="noteCard"><img src="/img/notes/sharepoint-permission-audit-with-powershell.jpg" width="720" height="900" loading="lazy" alt="Summary card: Auditing SharePoint permissions with PowerShell"><figcaption>The one-page summary card for this note.</figcaption></figure>
