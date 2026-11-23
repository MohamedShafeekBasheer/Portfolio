---
title: "Automating invoices safely into Dynamics 365"
slug: safe-invoice-automation-dynamics-365
date: 2026-12-12
summary: Posting vendor invoices into Dynamics 365 Finance & Operations with Power Platform was simple. Making it safe took most of the work. Three design rules for any automation that touches money.
description: "Lessons from automating vendor invoice posting into Dynamics 365 F&O: duplicate prevention, retries and Teams alerts for automation that touches money."
tags: [Power Automate, Dynamics 365, Power Platform, Case study]
---
At AQS-PEPSI I built a Power Platform integration that posts **vendor invoices into Dynamics 365 Finance & Operations**.

Getting an invoice from one system into the other was the simple part. **Making it safe** took most of the work, because when automation touches money, the failure cases matter more than the happy path.

## Rule 1: the same invoice must never post twice

Flows re-run. Someone resubmits a failed run, a trigger fires twice, a network glitch makes a step look failed when it actually succeeded. If each run simply posts the invoice, any of these can pay a supplier twice.

So before posting, the integration checks whether that invoice has already been posted, using values that identify it uniquely, such as the vendor and the invoice number. If it's already there, the flow stops and records why.

Design question to ask first: **"What happens if this runs twice?"** If the answer is "a duplicate payment", fix that before anything else.

## Rule 2: a temporary failure shouldn't lose an invoice

Systems are briefly unavailable, tokens expire, a service is slow. The integration uses **retry logic**, so a temporary failure is tried again instead of dropping the invoice. Retries are only safe because of rule 1: a retried post can't create a duplicate.

## Rule 3: when something fails, a person knows straight away

A failed flow that nobody notices is worse than no automation at all, because everyone assumes it worked. When a posting fails after its retries, a **Microsoft Teams alert** tells the team which invoice failed and why, so someone can act the same day.

## The result

- Vendor invoice posting is **automated**.
- **Duplicate postings are prevented.**
- **Failures are retried automatically, and alerted in Teams** when they need a person.

## For anyone automating finance processes

Before building, write down three things: how you'll **detect a duplicate**, what you'll **retry and how many times**, and **who gets told** when it fails. Those three answers are most of the design.

The [case study](/work/dynamics-365-invoice-integration/) has a short summary.

<figure class="noteCard"><img src="/img/notes/safe-invoice-automation-dynamics-365.jpg" width="720" height="900" loading="lazy" alt="Summary card: Automating invoices safely into Dynamics 365"><figcaption>The one-page summary card for this note.</figcaption></figure>
