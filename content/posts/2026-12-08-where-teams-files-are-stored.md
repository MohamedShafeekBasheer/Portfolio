---
title: "Where Microsoft Teams files really live"
slug: where-teams-files-are-stored
date: 2026-12-08
summary: Files in a Teams channel are stored in SharePoint, and files shared in a chat are stored in OneDrive. Knowing that explains how to recover them, find them and control who sees them.
description: "Teams channel files live in SharePoint and chat files in OneDrive. Where exactly, and how that helps with version history, recovery and access."
tags: [Microsoft Teams, SharePoint Online, OneDrive, Beginners]
---
Teams looks like its own app, but it doesn't store files itself. Every file you share in Teams lives in **SharePoint** or **OneDrive**. Once you know where, a lot of Teams problems become easy.

## Channel files live in SharePoint

- Every team has a **SharePoint team site** behind it.
- Each **standard channel** is a **folder** in that site's **Documents** library. The *General* channel is the *General* folder, a channel called *Budget* is the *Budget* folder, and so on.
- **Private** and **shared** channels are different: each one gets **its own separate SharePoint site**, so that only that channel's members can reach the files.

The **Files** tab in a channel is a view of that SharePoint folder.

## Chat files live in OneDrive

When you share a file in a **one-to-one or group chat**, it's uploaded to **your OneDrive**, into a folder called **Microsoft Teams Chat Files**, and shared with the people in the chat.

So if you leave the company and your OneDrive is removed, files you shared in chats can go with it. Anything the team needs long-term belongs in a channel, not a chat.

## Why it matters

Because the files are in SharePoint, everything SharePoint can do works for Teams files:

- **Version history:** in the Files tab, open **⋯ › Version history** to see or restore earlier versions.
- **Recycle bin:** a file deleted in Teams is in the SharePoint site's recycle bin. Use **Open in SharePoint**, then **Recycle bin**.
- **Sync:** the **Sync** button in the Files tab syncs the channel folder to File Explorer.
- **Permissions:** team owners and members map to the site's owners and members.
- **Search, retention and sensitivity labels** all apply, because it's SharePoint content.

## The practical tip

When something goes wrong with a file in Teams, click **Open in SharePoint**. Recovering a deleted file, checking who has access or restoring a version is usually easier there, and it's where your IT team will look.

<figure class="noteCard"><img src="/img/notes/where-teams-files-are-stored.jpg" width="720" height="900" loading="lazy" alt="Summary card: Where Microsoft Teams files really live"><figcaption>The one-page summary card for this note.</figcaption></figure>
