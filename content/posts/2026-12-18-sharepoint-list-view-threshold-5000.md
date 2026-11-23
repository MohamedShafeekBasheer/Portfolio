---
title: "The SharePoint 5,000-item list limit, explained"
slug: sharepoint-list-view-threshold-5000
date: 2026-12-18
summary: '"This view cannot be displayed because it exceeds the list view threshold." What the 5,000-item limit really is, why a list can hold far more, and how indexed columns and filtered views fix it.'
description: "What the SharePoint 5,000-item list view threshold really means, and how indexed columns and filtered views keep large lists working."
tags: [SharePoint Online, Microsoft Lists, SharePoint tips]
---
Sooner or later a busy SharePoint list or library shows this message:

> *This view cannot be displayed because it exceeds the list view threshold.*

It sounds like the list is full. It isn't.

## What the limit really is

- A list or library can hold **millions of items**.
- The **list view threshold** is **5,000 items**. It limits how many items a single operation, such as showing a view, may **scan** at once.
- It exists to keep the shared database fast for everyone, and **it can't be changed** in SharePoint Online.

So the problem isn't the size of the list. It's a view that asks SharePoint to look through more than 5,000 items to work out what to show.

## The fix: indexed columns and filtered views

An **index** lets SharePoint jump straight to the matching items instead of scanning them all.

**1. Index the columns you filter or sort by.**
Go to **List settings › Indexed columns › Create a new index** and pick the column. Good candidates: *Status*, *Department*, *Created*, *Assigned to*. A list can have up to 20 indexes.

**2. Make views that filter on an indexed column first.**
The **first** filter in the view should use an indexed column and narrow the results below 5,000. For example: *Status = Open*, or *Created is within the last 30 days*.

**3. Avoid sorting or grouping large views by non-indexed columns.**

## Do it early

Add indexes **while the list is still small**. On a list that is already very large, creating an index can be slow or blocked. When you set up a list you expect to grow (requests, logs, tickets), add the indexes on day one.

## Other ways to stay under the limit

- **Folders**: each folder is counted separately, so one top-level folder per year keeps each one smaller. (Keep folder trees shallow; see [Folders or columns?](/notes/folders-vs-columns-in-sharepoint/))
- **Archive**: move old, closed items to an archive list once a year.
- **Power Apps and Power Automate** hit the same rule. Filter on indexed columns there too (see [the 500-row surprise](/notes/power-apps-delegation-500-row-limit/)).

The modern list experience handles large lists better than the classic one, and can create some indexes for you. Planning the indexes yourself is still the reliable way.

<figure class="noteCard"><img src="/img/notes/sharepoint-list-view-threshold-5000.jpg" width="720" height="900" loading="lazy" alt="Summary card: The SharePoint 5,000-item list limit, explained"><figcaption>The one-page summary card for this note.</figcaption></figure>
