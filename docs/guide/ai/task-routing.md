# Task Routing

Different AI tasks have different requirements. Photo analysis needs a multimodal model, while text extraction and simple commands work fine with a smaller, cheaper one. Task Routing lets you set the provider, model, and endpoint URL per task group.

OpenBin groups AI tasks into three categories:

| Task Group | Tasks Included | Typical Model Choice |
|---|---|---|
| **Vision** | Photo analysis | A multimodal model (e.g. `gpt-5-mini`, `gemini-3-flash-preview`) |
| **Quick Text** | Commands, execute, text extraction/structuring | A fast, cheap model (e.g. `gpt-4.1-mini`, `claude-haiku-4-5`) |
| **Deep Text** | Inventory queries, reorganization | A capable reasoning model |

Each group can override any combination of provider, model, and endpoint URL. Unset fields inherit from your default AI configuration.

## Example configurations

**OpenAI**
| Group | Model |
|---|---|
| Vision | `gpt-5-mini` |
| Quick Text | `gpt-4.1-mini` |
| Deep Text | `gpt-5-mini` |

**Anthropic**
| Group | Model |
|---|---|
| Vision | `claude-sonnet-4-6` |
| Quick Text | `claude-haiku-4-5` |
| Deep Text | `claude-sonnet-4-6` |

**Google Gemini**
| Group | Model |
|---|---|
| Vision | `gemini-3-flash-preview` |
| Quick Text | `gemini-2.5-flash` |
| Deep Text | `gemini-3-flash-preview` |

## Mixed-provider example

You can route different task groups to entirely different providers. For example, use Gemini for photo analysis and Anthropic for everything else:

| Group | Provider | Model |
|---|---|---|
| Vision | Google Gemini | `gemini-3-flash-preview` |
| Quick Text | Anthropic | `claude-haiku-4-5` |
| Deep Text | Anthropic | `claude-sonnet-4-6` |

## How to configure

1. Go to **Settings → AI → Task Routing**.
2. Select a task group (Vision, Quick Text, or Deep Text).
3. Optionally override the provider, model, and endpoint URL for that group.
4. Save.

Leave all fields blank for a group to use your default AI configuration.

::: tip
One model for all tasks is a fine starting point. You can always add per-group overrides later — e.g. a cheaper model for Quick Text.
:::

## Server-wide task routing

Admins can lock task routing for specific groups via environment variables. When a group is configured by the server, it appears as read-only in the UI and cannot be changed by individual users. See the [Configuration Reference](/docs/getting-started/configuration#ai-task-routing) for the full list of per-group variables.

## Env-locked AI keys

When the server-wide `AI_API_KEY` (or one of the per-group `AI_VISION_API_KEY` / `AI_QUICK_TEXT_API_KEY` / `AI_DEEP_TEXT_API_KEY` keys) is set, the corresponding fields appear masked and read-only in the user UI; users cannot edit or delete them. This is how self-hosted admins provide AI to all users without storing individual keys.

## Cloud AI credits

On the cloud product, each plan includes an AI credit budget on a **rolling 30-day window** — the period resets 30 days after your first request, not on the calendar month. Self-hosted instances are not credit-limited; AI calls go directly to your configured provider.

Cost is flat per unit — no formulas, no batch discounts:

| Class | What it covers | Credit cost |
|---|---|---|
| Quick text | Ask, command, query, structure-text, correct | **1 per request** |
| Vision | Photo analysis, reanalysis | **5 per image** — so 1 photo = 5, 2 = 10, 3 = 15 |
| Reorganize | Reorganize, tag suggestions | **2 per bin** — so 7 bins = 14, 30 = 60, 100 = 200 |

Headline budgets:

- **Free**: 30 credits/month
- **Plus**: 100 credits/month
- **Pro**: 700 credits/month
- **Trial**: 30 lifetime credits (no monthly reset). CSV export is available during the trial; full JSON/ZIP export unlocks once you subscribe.

Credits are debited atomically before each request and refunded automatically if the upstream provider fails before producing a usable result. Your remaining credits and reset date are visible in **Settings → AI**, and the in-app composer surfaces the per-request cost before you submit.

## Network security (self-hosted)

AI provider calls run through an allowlist with DNS pinning to prevent SSRF attacks against internal network resources. Self-hosted mode relaxes this to allow private addresses, so local endpoints like Ollama (`http://localhost:11434/v1`) work without configuration.
