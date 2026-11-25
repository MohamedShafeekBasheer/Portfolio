---
title: "Proving zero loss in a SharePoint migration"
slug: proving-zero-loss-in-a-sharepoint-migration
date: 2026-12-06
summary: Copying 45,000 documents is the easy part of a migration. Proving that nothing was lost is the part that matters. The reconciliation method I use, step by step.
description: "How to prove nothing was lost in a SharePoint migration: counts and sizes per library before and after, and a reconciliation you can show people."
tags: [Migration, SharePoint Online, Case study]
---
I recently moved more than **45,000 documents (about 60 GB)** across **several legal entities** into a new structure. The migration finished with **verified zero loss**.

The copying itself was the easy part. Tools do that. The part that matters, and the part people skip, is **proving** nothing was lost.

## Why proof matters

A few weeks after any migration, someone will say "my file is missing". Sometimes it is. Usually it was moved, renamed, or never in the place they remember. Without evidence, you can't tell which, and confidence in the new system drops.

With a reconciliation, you can answer in minutes: *it was in this library, here is where it is now.*

## The method

**1. Count before you start.**
For every source library, record the number of files and the total size. Do it per library, not just in total. Export it to a spreadsheet and keep it.

**2. Plan the mapping.**
Write down where each source library goes in the new structure. When content is being reorganised, as it was here, this mapping is what you'll reconcile against.

**3. Migrate in batches.**
Move one entity or one department at a time. It's easier to check, and a problem in one batch doesn't affect the others.

**4. Count again after each batch.**
Same numbers for the destination: files and size per library.

**5. Compare per library.**
Put source and destination side by side. Totals can match while one library is short and another has duplicates, so compare at library level. Investigate every difference until it's explained: skipped system files, blocked file types, names that were too long, duplicates that were removed on purpose.

**6. Keep the reconciliation as a document.**
This is your evidence. Store it with the project records.

## What usually causes differences

- **Path length.** Deep folders plus long names can exceed SharePoint's 400-character path limit.
- **Blocked or unusual file types**, and temporary files like `~$report.docx`.
- **Invalid characters** in file names, depending on the source system.
- **Version history.** Decide early whether you're moving all versions or only the latest; it changes the size numbers.

## The result

45,000+ documents, several legal entities, reorganised into a new structure, with a reconciliation showing **zero loss**. When questions came later, the answer was in the document.

The [case study](/work/group-document-migration/) has a short summary.

<figure class="noteCard"><img src="/img/notes/proving-zero-loss-in-a-sharepoint-migration.jpg" width="720" height="900" loading="lazy" alt="Summary card: Proving zero loss in a SharePoint migration"><figcaption>The one-page summary card for this note.</figcaption></figure>
