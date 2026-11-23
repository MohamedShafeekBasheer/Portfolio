---
title: "Power Apps delegation: the 500-row surprise"
slug: power-apps-delegation-500-row-limit
date: 2026-12-11
summary: A filter that works in testing misses records in production. Usually the cause is delegation. What it is, how to spot it, and how to write formulas that work on large SharePoint lists.
description: "Why a Power Apps filter misses records past row 500: delegation explained, how to spot the warning, and how to fix formulas on large SharePoint lists."
tags: [Power Apps, SharePoint Online, Power Platform]
---
A common story: the app works perfectly in testing with 50 items. Months later, with 3,000 items in the list, people say records are "missing". Nothing is missing. The app just isn't looking at them.

The cause is almost always **delegation**.

## What delegation means

When you write a formula like a `Filter` over a SharePoint list, Power Apps tries to send (**delegate**) the work to SharePoint, so SharePoint does the filtering and returns only the matching items. That works for any size of list.

If the formula uses something SharePoint can't do, Power Apps can't delegate it. Instead it downloads the **first 500 items** and filters those on the device. Everything after item 500 is silently ignored.

You can raise the limit to **2,000** in **Settings › General › Data row limit**, but that only moves the problem.

## How to spot it

In Power Apps Studio, a formula that can't be delegated shows a **yellow warning triangle** and a **blue wavy underline**. Hover over it and it says the formula "might not work correctly on large data sets".

A useful test: temporarily set the data row limit to **1**. Anything that now shows wrong results depends on a non-delegable formula.

## How to fix it

Rewrite the formula using things SharePoint can do itself. For SharePoint lists, these generally delegate:

- `Filter` with simple comparisons: `=`, `<>`, `<`, `>`, on text, number, date, choice and person columns;
- `StartsWith` on text columns;
- `Sort` on a single column;
- combining conditions with `And` (`&&`).

These generally **don't** delegate to SharePoint, so avoid them on large lists:

- `Search()` and the `in` operator for "contains" searches;
- functions applied to the column, like `Len(Title)` or `Year(Created) = 2026`;
- some complex column types and lookups.

For example, instead of `Year(Created) = 2026`, use `Created >= Date(2026,1,1) && Created < Date(2027,1,1)`.

## Don't forget the list itself

On lists over **5,000 items**, SharePoint also needs **indexes** on the columns you filter by, or queries can fail because of the list view threshold. Index the columns your app filters on early, before the list gets large.

Microsoft's documentation keeps an up-to-date table of what each data source can delegate. It's worth checking when you design an app that will grow.

<figure class="noteCard"><img src="/img/notes/power-apps-delegation-500-row-limit.jpg" width="720" height="900" loading="lazy" alt="Summary card: Power Apps delegation: the 500-row surprise"><figcaption>The one-page summary card for this note.</figcaption></figure>
