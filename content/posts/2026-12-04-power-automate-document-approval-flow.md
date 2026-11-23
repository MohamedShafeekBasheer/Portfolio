---
title: "Your first Power Automate approval flow"
slug: power-automate-document-approval-flow
date: 2026-12-04
summary: A four-step flow that asks for approval whenever a document is added to a SharePoint library, records the decision, and tells the person who uploaded it. Built in about fifteen minutes.
description: "Build a Power Automate approval flow for a SharePoint library in four steps: trigger, approval, status column update and a notification."
tags: [Power Automate, SharePoint Online, Beginners]
---
Approvals by email get lost. A small Power Automate flow puts every request in one place and keeps a record of every decision. This one runs whenever someone adds a document to a library.

## Before you start

In your library, add a **Choice** column called **Status** with three options: *Pending*, *Approved* and *Rejected*. Set the default to *Pending*.

## Build the flow

Go to **make.powerautomate.com › Create › Automated cloud flow**. Name it, and pick the trigger below.

**1. Trigger: "When a file is created (properties only)"** (SharePoint)
Choose your site address and library. *Properties only* means the flow gets the file's details without downloading the content, which is all an approval needs.

**2. Action: "Start and wait for an approval"** (Approvals)
- Approval type: **Approve/Reject – First to respond**
- Title: something like `Please approve: ` followed by the **File name with extension** from the trigger
- Assigned to: the approver's email (or several, separated by semicolons)
- Item link: the **Link to item** from the trigger, so the approver can open the document

**3. Condition: Outcome is equal to Approve**
Add a **Condition** with the **Outcome** from the approval step on the left, *is equal to*, and the word `Approve` on the right.

- **If yes:** add **Update file properties** (SharePoint), choose the same site and library, use the **ID** from the trigger, and set Status to *Approved*.
- **If no:** the same action, with Status set to *Rejected*.

**4. Tell the person who uploaded it**
In both branches, add **Send an email (V2)** (Office 365 Outlook). Send it to **Created By Email** from the trigger, and include the approver's **Comments** from the approval step so they know why.

Save, upload a test file, and watch the run under **My flows**.

## What the approver sees

The request appears in **Teams** (the Approvals app), in **Outlook** as an actionable email, and at **Power Automate › Approvals**. They can approve from whichever they prefer and add a comment.

## Small improvements once it works

- Make a **view** in the library filtered to *Status = Pending*, so you can see what's waiting.
- Use a **trigger condition** so the flow only runs for certain folders or file types.
- Add a **timeout** to the approval step and a reminder if nobody responds within a few days.
- Run the flow from a **shared service account** rather than your own account, so it keeps working if you change role.

That's a real approval process, with history, in about fifteen minutes.

<figure class="noteCard"><img src="/img/notes/power-automate-document-approval-flow.jpg" width="720" height="900" loading="lazy" alt="Summary card: Your first Power Automate approval flow"><figcaption>The one-page summary card for this note.</figcaption></figure>
