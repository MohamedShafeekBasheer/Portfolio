---
title: "Conditional Access: the first two policies"
slug: first-two-conditional-access-policies
date: 2026-12-17
summary: New to Microsoft Entra Conditional Access? Start with two policies, require MFA for everyone and block legacy authentication, and roll them out in report-only mode first. Step by step.
description: "The first two Conditional Access policies to create in Microsoft Entra: require MFA and block legacy authentication, with report-only rollout."
tags: [Microsoft Entra ID, Conditional Access, Security, Admins]
---
Conditional Access is how Microsoft Entra ID decides whether a sign-in is allowed, and under what conditions. It can do a lot, which makes it hard to know where to start.

Start with two policies. Together they stop a large share of everyday account attacks.

## Before you begin

- Conditional Access needs **Microsoft Entra ID P1** or higher (included in Microsoft 365 Business Premium and E3/E5).
- If your tenant uses **security defaults**, they must be turned off before you can use Conditional Access. Have your policies ready first, so there's no gap.
- Create **two break-glass (emergency access) accounts**: cloud-only admin accounts with long, securely stored passwords, **excluded** from these policies. If a policy goes wrong, they're how you get back in.

## Policy 1: require MFA for all users

In the **Microsoft Entra admin center › Protection › Conditional Access › Create new policy**:

- **Users:** All users. **Exclude** the break-glass accounts.
- **Target resources:** All cloud apps (all resources).
- **Grant:** Grant access, **Require multifactor authentication**.
- **Enable policy:** **Report-only**.

## Policy 2: block legacy authentication

Legacy authentication (old protocols like POP, IMAP and basic authentication in older clients) can't do MFA, so attackers use it to get around policy 1.

- **Users:** All users. **Exclude** the break-glass accounts.
- **Target resources:** All cloud apps.
- **Conditions › Client apps:** select **Exchange ActiveSync clients** and **Other clients**.
- **Grant:** **Block access**.
- **Enable policy:** **Report-only**.

## Roll out safely

1. Leave both policies in **report-only** for about a week.
2. Check the **sign-in logs**: open a sign-in, then the **Report-only** tab, to see what each policy *would* have done.
3. Look for people and devices that would be blocked: an old printer that sends email, a service account, someone on an ancient mail app. Fix or plan for each.
4. Tell users MFA is coming and how to set up the **Microsoft Authenticator** app.
5. Switch each policy to **On**, one at a time.

## After these two

Good next steps are requiring **phishing-resistant MFA for admins**, and policies based on **device compliance** or **sign-in risk** (risk needs Entra ID P2). But get these two right first.

<figure class="noteCard"><img src="/img/notes/first-two-conditional-access-policies.jpg" width="720" height="900" loading="lazy" alt="Summary card: Conditional Access: the first two policies"><figcaption>The one-page summary card for this note.</figcaption></figure>
