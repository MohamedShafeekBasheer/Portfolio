---
title: "A Power App from a SharePoint list in 2 minutes"
slug: power-apps-from-a-sharepoint-list
date: 2026-12-10
summary: You don't need to start Power Apps from a blank screen. One menu in a SharePoint list builds a working three-screen app on your own data, which is the fastest way to learn Power Apps.
description: "Build a working Power App from a SharePoint list in two minutes with Integrate › Power Apps › Create an app, then the first changes to make."
tags: [Power Apps, SharePoint Online, Beginners]
---
Starting Power Apps from a blank screen is hard: an empty canvas, and no idea where to begin. There's a shortcut that gives you a working app in about two minutes, built on your own data.

## Build it

1. Open a **SharePoint list** (for example an issue tracker or asset list).
2. On the command bar, choose **Integrate › Power Apps › Create an app**.
3. Give the app a name and choose **Create**.

Power Apps Studio opens with a finished app that has three screens:

- **Browse screen:** a gallery of items, with search and sort.
- **Detail screen:** one item's details.
- **Edit screen:** a form to add or change an item.

It's already connected to your list. Press **Play** (▷) and try it: add an item, edit it, then look at the list in SharePoint. The change is there.

## Your first changes

These are good first edits, and each one teaches something:

- **Choose which fields appear.** Select the form on the edit screen, then **Edit fields** in the properties pane. Remove the ones nobody fills in.
- **Change what the gallery shows.** Select the gallery and change the fields in its layout. Show the title and status, for example.
- **Rename buttons and headings.** Select a label and change its **Text** property.
- **Add your logo and colours.** Insert an image, and change the header's **Fill** colour.

Then **Save** and **Publish**. Share the app with the same people who use the list. They'll also need access to the list itself, because the app reads and writes it as them.

## Why this is the best way to learn

Every formula in the generated app is a working example: how the gallery filters, how the form submits, how screens navigate. Click on things and read the formulas in the formula bar. You're learning from a real app, on data you understand.

When you want to go further, look at **delegation** before your list gets big. It's the most common surprise in Power Apps on SharePoint, and the subject of the next note.

<figure class="noteCard"><img src="/img/notes/power-apps-from-a-sharepoint-list.jpg" width="720" height="900" loading="lazy" alt="Summary card: A Power App from a SharePoint list in 2 minutes"><figcaption>The one-page summary card for this note.</figcaption></figure>
