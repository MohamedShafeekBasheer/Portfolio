---
title: "From days to minutes: a contract platform on SPFx"
slug: contract-platform-on-spfx-and-azure
date: 2026-11-29
summary: How a contract process that took several days became a few minutes, using SPFx, Azure Functions, Key Vault and DocuSign on systems the company already owned, and the network problem nobody planned for.
description: "How SPFx, Azure Functions, Key Vault and DocuSign took a contract process from several days to minutes, and the firewall gap that held it up."
tags: [SPFx, Azure Functions, SharePoint Online, Case study]
---
At AQS-PEPSI, turning margin contribution figures into a signed contract used to take several days of manual work.

The data needed already existed, in an internal Azure SQL data warehouse. It just wasn't connected to the process.

## What I built

- **An SPFx front end (React and TypeScript) inside SharePoint.** People start and track contracts where they already work, with no new app to learn.
- **Azure Functions** that read live sales data from the warehouse, so a contract is built from current numbers, not a copy from last week.
- **Azure Key Vault** for every credential and **Microsoft Entra ID** for sign-in. No passwords in code or configuration files.
- **DocuSign for e-signature**, reached through a small credential-broker Function. The browser never sees a signing credential, which also keeps the design aligned with Saudi Arabia's Personal Data Protection Law (PDPL).

## The part nobody plans for

The code was not the slow part. The Function App in Azure couldn't reach the data warehouse on the company network at all.

It turned out to be a firewall allowlisting gap between Azure and the on-premises network. Diagnosing it took longer than writing the integration. Once it was found and closed, I verified the connection was both working and secure before going any further.

The lesson I took from it: **when a cloud service has to reach something on-premises, test the network path on day one**, before you build anything on top of it.

## The result

- Contract processing went from **several days to minutes**.
- **28 ms** end-to-end response for the live data lookups.
- Built entirely on **systems the company already owned**: SharePoint, Azure and the existing warehouse. No new platform licences.
- Approved at Chief Officer and Director level.

## What I'd tell anyone building something similar

1. **Start from the data you already have.** The value here came from connecting an existing warehouse to an existing process.
2. **Keep secrets on the server.** A credential-broker Function is a few dozen lines and removes a whole class of risk.
3. **Prove the network path first.** It is the least interesting task and the one most likely to stall the project.

The [full case study](/work/contract-management-platform/) has more detail on the design.

<figure class="noteCard"><img src="/img/notes/contract-platform-on-spfx-and-azure.jpg" width="720" height="900" loading="lazy" alt="Summary card: From days to minutes: a contract platform on SPFx"><figcaption>The one-page summary card for this note.</figcaption></figure>
