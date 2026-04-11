---
title: Privacy Policy — OpenBin
description: How OpenBin handles your data across self-hosted and cloud deployments, analytics, AI features, and third-party services.
---

# Privacy Policy

**Last updated:** April 10, 2026

OpenBin is an open-source inventory management app (AGPL-3.0). This policy explains what data OpenBin collects, how it is used, and what choices you have. It covers both the self-hosted version and OpenBin Cloud.

## Self-hosted vs. Cloud

How your data is handled depends on how you run OpenBin.

### Self-hosted

When you self-host OpenBin, everything runs on your own hardware. Your inventory data, photos, and user accounts stay on your server. OpenBin does not phone home, collect telemetry, or send data anywhere unless you explicitly configure AI features (see below).

You are responsible for your own backups, updates, and security.

### OpenBin Cloud

When you use [OpenBin Cloud](https://cloud.openbin.app), your data is stored on managed infrastructure operated by OpenBin. This includes your account information (email, name, password hash), inventory data (locations, areas, bins, items), uploaded photos, and any AI-generated content.

Cloud data is used solely to provide the service. It is not sold, rented, or shared with third parties for advertising or analytics purposes.

## Account information

OpenBin Cloud accounts require an email address and password. Passwords are hashed and never stored in plain text. Your email is used for account access, billing notifications, and service-related communication only. You will not receive marketing emails.

Self-hosted instances manage their own accounts entirely on your server.

## Analytics

The OpenBin marketing website (openbin.app) uses [Umami](https://umami.is), a privacy-focused analytics tool. Umami does not use cookies, does not collect personal data, and does not track you across sites. It records aggregate page views and referrer information only.

The OpenBin application itself (whether self-hosted or cloud) does not include any analytics or telemetry.

## AI features

OpenBin offers optional AI features such as photo recognition, natural language commands, and AI-powered reorganization suggestions. When you use these features, data is sent to the AI provider you have configured:

- **OpenAI** — [Privacy policy](https://openai.com/privacy)
- **Anthropic** — [Privacy policy](https://www.anthropic.com/privacy)
- **Google Gemini** — [Privacy policy](https://policies.google.com/privacy)

What gets sent depends on the feature: photo recognition sends your photos, and natural language commands send your text input along with relevant inventory context.

On self-hosted instances, AI features are off by default. You choose whether to enable them and which provider to use. No data is sent to any AI provider unless you explicitly configure an API key and trigger an AI action.

On OpenBin Cloud, AI features are available on paid plans. The same principle applies: data is only sent to the AI provider when you actively use an AI feature.

OpenBin does not use your data to train AI models. Refer to each provider's privacy policy for their data handling practices.

## Data storage and security

**Cloud:** Data is stored on managed servers with encrypted connections (TLS). Backups are performed automatically. Access to infrastructure is restricted to the OpenBin operator.

**Self-hosted:** Security is your responsibility. OpenBin uses bcrypt for password hashing and supports HTTPS when configured behind a reverse proxy.

## Data export and deletion

You can export your data at any time in CSV or JSON format, including photos. This applies to both self-hosted and cloud deployments.

**Cloud users:** You can delete your account and all associated data by contacting us. When an account is deleted, all inventory data, photos, and account information are permanently removed.

**Self-hosted users:** You control your own data entirely. Delete it whenever you want.

## Billing

OpenBin Cloud billing is handled through [billing.openbin.app](https://billing.openbin.app). Payment processing is managed by a third-party payment provider. OpenBin does not store your full credit card number or payment credentials.

## Cookies

The OpenBin marketing website does not use cookies. The OpenBin application uses a session token (JWT) stored in your browser to keep you logged in. This is a functional cookie required for the application to work, not a tracking cookie.

## Third-party services

Beyond the AI providers listed above, OpenBin does not share your data with third parties. There are no advertising networks, data brokers, or social media trackers.

## Children's privacy

OpenBin is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has created an account, contact us and we will delete it.

## Changes to this policy

If this policy changes, the updated version will be posted here with a new "last updated" date. For significant changes, we will note the update on the OpenBin website.

## Contact

Questions about this policy or your data:

- **Discord**: [discord.gg/W6JPZCqqx9](https://discord.gg/W6JPZCqqx9)
- **GitHub**: [github.com/akifbayram/openbin](https://github.com/akifbayram/openbin)
