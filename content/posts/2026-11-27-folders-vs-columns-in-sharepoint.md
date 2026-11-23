---
title: "Folders or columns? Organising a SharePoint library"
slug: folders-vs-columns-in-sharepoint
date: 2026-11-27
summary: Deep folder trees are the most common problem in SharePoint libraries. Columns and views do the same job better, and you can switch one library at a time.
description: "Why deep folders cause trouble in SharePoint libraries, and how to use columns and views instead, step by step, without a big migration."
tags: [SharePoint Online, Beginners, SharePoint tips]
---
Most SharePoint libraries I'm asked to fix have the same problem: folders inside folders inside folders. *Finance › 2025 › Invoices › Supplier A › Q3 › Approved*.

Folders feel familiar because they work like the drives people grew up with. In SharePoint they cause three kinds of trouble.

## Why deep folders hurt

**Long paths break.** SharePoint Online allows up to 400 characters for the full decoded path of a file, including the site address, library, every folder name and the file name. Deep trees with descriptive names reach that sooner than you'd think. Then sync fails, copies fail, and moving a folder fails halfway.

**A file can only live in one place.** Is the signed supplier contract under *Legal*, *Procurement* or *Supplier A*? Every person answers differently, so people guess, and the same file gets uploaded twice.

**Permissions end up on folders.** Someone breaks inheritance on one folder "just for now". A year later nobody knows why a manager can't see half the library.

## What to do instead: columns and views

A column is a label you attach to every file, like a property. A view is a saved filter over those labels.

1. Open the library and choose **+ Add column**.
2. Add two or three **Choice** columns that match how people search: for example *Department*, *Year* and *Document type*.
3. Fill them in for existing files. In grid view (**Edit in grid view**) you can paste a value down a whole column at once.
4. Make views people actually use. Filter the library, then **Save view as**, for example *Invoices 2026* or *My department*.
5. Make the most useful view the default.

Now one file can show up in *Finance*, in *Invoices* and in *2026* without being copied, because each view is just a different filter. And the path stays short.

You can also make a column required, so nobody uploads a file without choosing its *Document type*.

## Folders still have a place

Don't remove every folder. A single top level is fine, and sometimes helpful:

- one folder per **year**, so old material is easy to archive;
- a folder for content that really does need **different permissions**, though a separate library is usually cleaner;
- very large libraries, where a top-level folder keeps each view under the 5,000-item threshold.

The rule I use: **at most one or two levels of folders, and everything else in columns.**

## Switching an existing library

You don't need a big migration. Start with the library that causes the most "where is it?" questions. Add the columns, tag new files from today, and tag older files as people touch them. Once the views work, people stop opening folders on their own.

<figure class="noteCard"><img src="/img/notes/folders-vs-columns-in-sharepoint.jpg" width="720" height="900" loading="lazy" alt="Summary card: Folders or columns? Organising a SharePoint library"><figcaption>The one-page summary card for this note.</figcaption></figure>
