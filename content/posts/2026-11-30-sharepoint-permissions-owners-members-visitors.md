---
title: "SharePoint permissions without the mess"
slug: sharepoint-permissions-owners-members-visitors
date: 2026-11-30
summary: Every SharePoint site has three groups, Owners, Members and Visitors. Using only those groups keeps access understandable for years. Here is how, and what to do when a few files need to be different.
description: "Owners, Members and Visitors: the simple way to manage SharePoint permissions, why breaking inheritance causes trouble, and what to do instead."
tags: [SharePoint Online, Beginners, Permissions]
---
"Who can see this?" should be an easy question. On many SharePoint sites it isn't, and the cause is almost always the same: permissions set file by file and folder by folder.

There is a simpler way, and it's built in.

## The three groups every site has

When a site is created, SharePoint gives it three groups:

| Group | What they can do |
|---|---|
| **Owners** | Everything, including changing settings and deciding who has access |
| **Members** | Add, edit and delete content |
| **Visitors** | Read only |

The rule for beginners: **give people access by adding them to one of these three groups, and stop there.**

On a team site connected to a Microsoft 365 group (every site behind a Microsoft Teams team is one), owners and members come from the group itself. Add people through the team or the group, and SharePoint follows.

Better still, add **security groups** or **Microsoft 365 groups** instead of individuals. When someone joins Finance, IT adds them to the Finance group once, and they get access to every site that uses it.

## Why "breaking inheritance" causes trouble

By default, every library, folder and file **inherits** permissions from its site. When you share a single file with someone, or set special permissions on a folder, you **break inheritance** for that item. It now has its own list of who can see it.

On day one this feels precise. On day 300:

- nobody remembers which items are different, or why;
- moving a file can change who can see it;
- leavers keep access to scattered items nobody thought to check;
- an audit means checking items one by one.

## When some files really do need different access

It happens: salaries, disciplinary cases, a confidential project. Instead of breaking inheritance on a folder, give that content its own place:

- **its own library** in the same site, with its own permissions (one exception, easy to see), or
- **its own site**, if a different group of people works on it.

One exception per library is easy to remember. Fifty exceptions on folders are not.

## Check a site in two minutes

Open the site, then **Settings (gear) › Site permissions**. You'll see the three groups and who is in each. For a closer look, **Advanced permissions settings** shows any items that no longer inherit permissions.

If the list of exceptions is long, that's a sign to tidy up: move the special content into its own library, then reset the rest to inherit.

<figure class="noteCard"><img src="/img/notes/sharepoint-permissions-owners-members-visitors.jpg" width="720" height="900" loading="lazy" alt="Summary card: SharePoint permissions without the mess"><figcaption>The one-page summary card for this note.</figcaption></figure>
