---
title: "Your first SharePoint admin report with PnP PowerShell"
date: 2026-11-21
summary: A beginner-friendly script that lists every SharePoint site with its template, sharing setting and storage — and the two things that trip people up when they first run it.
tags: [PnP PowerShell, SharePoint Online, Governance, Beginners]
sources:
  - https://pnp.github.io/script-samples/spo-export-basic-sitecollection-info/README.html
  - https://github.com/pnp/script-samples/tree/main/scripts/spo-export-basic-sitecollection-info
  - https://pnp.github.io/powershell/
---
Sooner or later someone asks: *how many SharePoint sites do we have, who can share them externally, and how much space are they using?* The people asking usually don't have access to the SharePoint admin center, so they need a spreadsheet.

This is the best first script to learn PnP PowerShell with. It's one connection, one command and one export, and the output is something people actually use.

## The script

This is a simplified version of Kasper Larsen's sample in the [PnP Script Samples](https://github.com/pnp/script-samples/tree/main/scripts/spo-export-basic-sitecollection-info) library (MIT licence). The original also connects to every site to read when it was last changed and whether it's a hub site. That's useful, but slow, and it asks you to sign in once per site, which isn't a good first experience.

```powershell
# Read-only: lists sites, changes nothing. Try it in a test tenant first.
# Needs PowerShell 7 and the PnP.PowerShell module:
#   Install-Module PnP.PowerShell -Scope CurrentUser

$adminUrl = "https://contoso-admin.sharepoint.com"   # your tenant's admin URL
$clientId = "00000000-0000-0000-0000-000000000000"   # your own Entra ID app (see below)

Connect-PnPOnline -Url $adminUrl -ClientId $clientId -Interactive

Get-PnPTenantSite |
    Select-Object Url, Template, LockState, SharingCapability, StorageUsageCurrent |
    Export-Csv -Path .\sharepoint-sites.csv -NoTypeInformation -Encoding utf8

Write-Host "Done. Open sharepoint-sites.csv in Excel."
```

## What you get

One row per site, with:

- **Url** and **Template**: team site, communication site, and so on.
- **LockState**: whether the site is read-only or locked.
- **SharingCapability**: who the site can be shared with. Anything other than `Disabled` or `ExistingExternalUserSharingOnly` deserves a second look.
- **StorageUsageCurrent**: storage used, in MB.

OneDrive sites aren't included by default, which is usually what you want for this report.

## Two things that trip beginners up

**1. You need your own app registration to sign in.** Many older blog posts and samples use `-UseWebLogin` or `-Interactive` with no `-ClientId`. Those no longer work with current PnP PowerShell: you now sign in through an Entra ID app registered in your own tenant. The PnP PowerShell documentation explains how to register one (there's a `Register-PnPEntraIDAppForInteractiveLogin` cmdlet for it). You'll need an admin to grant consent once.

**2. Run it in PowerShell 7, not Windows PowerShell 5.1.** Current PnP PowerShell needs PowerShell 7. If `Install-Module` or `Connect-PnPOnline` fails strangely, check `$PSVersionTable.PSVersion` first.

## Where to go next

Once this works, add columns from the full sample, or filter the list. For example, show only sites shared with anyone outside the organisation:

```powershell
# Read-only: lists sites, changes nothing. Try it in a test tenant first.
Get-PnPTenantSite | Where-Object SharingCapability -eq "ExternalUserAndGuestSharing" |
    Select-Object Url, Template, StorageUsageCurrent
```

That one line is the start of a sharing review, and sharing reviews are where a lot of real SharePoint security problems are found.
