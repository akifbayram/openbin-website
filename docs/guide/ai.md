---
prev:
  text: 'Photos'
  link: '/docs/guide/photos'
next:
  text: 'Bulk Add'
  link: '/docs/guide/bulk-add'
---

# AI Features

AI is optional. Connect your own API key or have an admin set a server-wide key. Everything else works without it.

## Supported Providers

| Provider | Recommended Model |
|---|---|
| **[OpenAI](https://platform.openai.com/)** | `gpt-5-mini` |
| **[Anthropic](https://console.anthropic.com/)** | `claude-sonnet-4-6` |
| **[Google Gemini](https://aistudio.google.com/)** | `gemini-3-flash-preview` |
| **OpenAI-compatible** | — |

### Getting an API key

Create an API key from your provider's developer platform:

- **OpenAI** — [platform.openai.com](https://platform.openai.com/) → API Keys. [Pricing →](https://platform.openai.com/docs/pricing)
- **Anthropic** — [console.anthropic.com](https://console.anthropic.com/) → API Keys. [Pricing →](https://docs.anthropic.com/en/docs/about-claude/pricing)
- **Google Gemini** — [aistudio.google.com](https://aistudio.google.com/) → Get API key. Free tier available. [Pricing →](https://ai.google.dev/gemini-api/docs/pricing)

## Per-User Setup

Configure your provider, API key, and model in **Settings → AI**. AI features activate immediately after saving.

## Server-Wide Setup (Admin)

Admins can configure a shared AI key via environment variables so all users get AI features without individual setup:

```ini
AI_PROVIDER=openai
AI_API_KEY=sk-...
AI_MODEL=gpt-5-mini
# For OpenAI-compatible endpoints:
AI_ENDPOINT_URL=https://your-endpoint.example.com/v1
```

Users can still configure their own keys in Settings → AI, which takes precedence over the server-wide key.

::: info
Set `AI_ENCRYPTION_KEY` to an AES-256-GCM key to encrypt stored API keys at rest. Without this, keys are stored as plaintext in the database.
:::

## Photo Analysis

![AI photo analysis](../assets/ai-photos.png)

After uploading a photo to a bin, tap **Analyze with AI** to get suggestions for bin name, items (with quantities), tags, and notes. Each field can be accepted or dismissed independently.

If the first pass missed items or suggested incorrect names, you can re-analyze to get improved results. Tap the sparkle icon on the photo preview and click **Reanalyze** (or type a specific correction). The reanalysis sends both the photos and the previous suggestions back to the AI, so it can refine its output based on what it already identified. Changed fields are highlighted so you can see exactly what was updated.

## Natural Language Commands

The AI command bar (accessible from the bin list) accepts natural language instructions:

```
Add screwdriver to the tools bin
Move batteries to the garage area
Create a bin called Holiday Decorations with items: lights, ornaments, wrapping paper
Remove the extension cord from the electrical bin
```

OpenBin shows a preview of the action and asks for confirmation before making changes.

## Inventory Search

Ask natural language questions to search across all bins:

```
Where did I put the holiday lights?
Which bins have batteries?
What's in the attic?
Do I have any sandpaper?
```

Returns matching bins with an explanation of why each matched.

## AI Reorganization

The Reorganize page lets AI suggest how to restructure an entire location's bins, areas, and tags — then apply those changes in bulk.

1. Navigate to **Reorganize** from the sidebar.
2. Select the bins to include (defaults to all).
3. Click **Suggest Reorganization** — AI streams back proposed changes: renaming bins, moving them between areas, updating tags, and creating new areas.
4. Review the preview showing all proposed changes side-by-side with current state.
5. Click **Apply** to execute the changes or dismiss individual suggestions.

A custom reorganization prompt can be set in **Settings → AI → Advanced** to guide the AI's restructuring logic (e.g. "group by room" or "consolidate similar items").

## Task Routing

Different AI tasks have different requirements. Photo analysis needs a multimodal model, while text extraction and simple commands work fine with a smaller, cheaper one. Task Routing lets you set the provider, model, and endpoint URL per task group.

OpenBin groups AI tasks into three categories:

| Task Group | Tasks Included | Typical Model Choice |
|---|---|---|
| **Vision** | Photo analysis | A multimodal model (e.g. `gpt-5-mini`, `gemini-3-flash-preview`) |
| **Quick Text** | Commands, execute, text extraction/structuring | A fast, cheap model (e.g. `gpt-4.1-mini`, `claude-haiku-4-5`) |
| **Deep Text** | Inventory queries, reorganization | A capable reasoning model |

Each group can override any combination of provider, model, and endpoint URL. Unset fields inherit from your default AI configuration.

### Example configurations

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

### Mixed-provider example

You can route different task groups to entirely different providers. For example, use Gemini for photo analysis and Anthropic for everything else:

| Group | Provider | Model |
|---|---|---|
| Vision | Google Gemini | `gemini-3-flash-preview` |
| Quick Text | Anthropic | `claude-haiku-4-5` |
| Deep Text | Anthropic | `claude-sonnet-4-6` |

### How to configure

1. Go to **Settings → AI → Task Routing**.
2. Select a task group (Vision, Quick Text, or Deep Text).
3. Optionally override the provider, model, and endpoint URL for that group.
4. Save.

Leave all fields blank for a group to use your default AI configuration.

::: tip
One model for all tasks is a fine starting point. You can always add per-group overrides later — e.g. a cheaper model for Quick Text.
:::

### Server-wide task routing

Admins can lock task routing for specific groups via environment variables. When a group is configured by the server, it appears as read-only in the UI and cannot be changed by individual users. See the [Configuration Reference](/docs/getting-started/configuration#ai-task-routing) for the full list of per-group variables.

## Custom Prompts

Advanced users can override the default AI prompts for each operation:

1. Go to **Settings → AI → Custom Prompts**.
2. Select a task tab and enter a custom prompt for photo analysis, commands, search queries, text structuring, or reorganization.
3. Save.

Custom prompts are useful for domain-specific terminology, non-English languages, or specialized inventory contexts.

::: tip
Leave a custom prompt field blank to use the built-in default for that operation.
:::

## Temperature and Token Settings

The advanced AI settings section exposes fine-tuning parameters:

| Parameter | Effect |
|---|---|
| Temperature | Controls randomness. Lower = more deterministic. Range: 0.0–2.0 |
| Max tokens | Caps the response length. |
| Top-p | Nucleus sampling probability. Lower = more focused output. |
| Request timeout | Seconds to wait before aborting an AI request. |

These settings apply per provider configuration.
