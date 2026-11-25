---
title: "Retiring InfoPath: what worked for 8 forms"
slug: retiring-infopath-what-worked
date: 2026-12-03
summary: Eight InfoPath forms, 500+ users and 15 departments moved to modern SharePoint before the deadline. The approach that worked, and the first step anyone still on InfoPath should take this week.
description: "How 8 InfoPath forms used by 500+ people were moved to modern SharePoint and Power Automate before the deadline, and where to start your own."
tags: [InfoPath, SharePoint Online, Power Automate, Case study]
---
InfoPath has been retired for years, yet many companies still run real business processes on it: requests, approvals, checklists. While it works, nobody touches it. When something breaks after support ends, there is nobody to fix it.

At a multi-company industrial group where I work, there were **8 InfoPath forms** used by **more than 500 people across 15 departments**. All 8 were live in modern SharePoint before the deadline. Here is what worked.

## 1. Make the list first

Before rebuilding anything, list every form with:

- what it's for, and which department owns it;
- who fills it in and who approves it;
- what happens after it's submitted (emails, approvals, reports);
- how often it's used.

That list is half the project. It shows which forms are critical, which are barely used, and which can be combined.

## 2. Rebuild one form at a time

Each form was rebuilt in modern SharePoint, using SPFx (React) where a form needed more than a list form can do. Doing one at a time meant each form was tested properly and each department only had to learn one change at a time.

Rebuild what the form **does**, not what it looks like. Old InfoPath forms often carry fields nobody fills in and rules nobody remembers. Ask the people who use it.

## 3. Move the logic to Power Automate

InfoPath forms often hide logic: send an email here, route to a manager there. Those approvals and notifications moved to **Power Automate**, where they're visible, logged and easy to change later.

## 4. Switch departments in stages

Departments moved over in stages, so work never stopped. A sensible pattern: keep the old form available until the new one has been used for real, then make the old one read-only so its history stays available.

## The result

- All **8 forms** live in production SharePoint **before the deadline**.
- **500+ users across 15 departments** moved off InfoPath.
- Approvals and notifications now run in Power Automate, where the IT team can see and change them.

## If you still have InfoPath forms

Start this week with the list in step 1. Open each site's form libraries and lists, note every InfoPath form and who uses it. You can't plan the work, or estimate it, without that list.

The [case study](/work/infopath-to-spfx-modernisation/) has a short summary of the project.

<figure class="noteCard"><img src="/img/notes/retiring-infopath-what-worked.jpg" width="720" height="900" loading="lazy" alt="Summary card: Retiring InfoPath: what worked for 8 forms"><figcaption>The one-page summary card for this note.</figcaption></figure>
