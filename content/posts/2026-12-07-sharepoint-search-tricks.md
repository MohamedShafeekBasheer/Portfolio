---
title: "Search SharePoint like an admin"
slug: sharepoint-search-tricks
date: 2026-12-07
summary: SharePoint search understands more than plain words. Four small tricks, file type, author, exact phrases and NOT, turn "I can't find it" into a ten-second search.
description: "Four SharePoint search tricks: filetype:, author:, exact phrases in quotes and NOT. How to combine them, plus the filters that do the same job."
tags: [SharePoint Online, Beginners, SharePoint tips]
---
Most people type one or two words into the SharePoint search box and scroll. Search understands much more than that. These four tricks cover most everyday searches.

## 1. Search for a file type

```
filetype:pdf contract
```

Only PDF files that mention *contract*. Works with `docx`, `xlsx`, `pptx`, `pdf` and other extensions.

## 2. Search by author

```
author:"Mohamed Shafeek"
```

Files created by that person. Use quotes around a full name.

## 3. Search for an exact phrase

```
"service level agreement"
```

Only results with those words together, in that order, instead of anywhere in the document.

## 4. Leave something out

```
budget NOT draft
```

Files about *budget* that don't mention *draft*. Type `NOT` in capitals; in lower case it's treated as an ordinary word.

## Combine them

```
filetype:xlsx budget author:"Finance Team" NOT draft
```

Excel files about budgets, from the Finance team, that aren't drafts.

## Where to search

- **The site's search box** searches that site. Use it when you know roughly where the file is.
- **The SharePoint start page, Office.com or the search box in Teams** search everything you have access to.

Search only ever shows what you're allowed to see. If a colleague can find a file and you can't, it's a permissions question, not a search question.

## If a trick doesn't work

Search in Microsoft 365 keeps changing, and not every search box supports every keyword. If one doesn't behave as expected, use the **filters** on the results page instead: **File type**, **Last modified** and **Author** do the same job with a few clicks.

## One more tip for site owners

Search is only as good as your file names and columns. *Scan_0034.pdf* is hard to find whatever you type. A clear name and a couple of columns (see [Folders or columns?](/notes/folders-vs-columns-in-sharepoint/)) make every search better.

<figure class="noteCard"><img src="/img/notes/sharepoint-search-tricks.jpg" width="720" height="900" loading="lazy" alt="Summary card: Search SharePoint like an admin"><figcaption>The one-page summary card for this note.</figcaption></figure>
