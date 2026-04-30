# AI Overview

AI is optional. Connect your own API key or have an admin set a server-wide key. Everything else works without it.

The AI features are split across these pages:

- [Photo Analysis](/docs/guide/ai/photo-analysis) — auto-fill bin name, items, tags, and notes from photos
- [AI Assistant](/docs/guide/ai/assistant) — natural-language commands and "where is X" search
- [AI Reorganization](/docs/guide/ai/reorganization) — bulk-restructure bins, areas, and tags
- [Task Routing](/docs/guide/ai/task-routing) — route different tasks to different providers/models
- [Custom Prompts & Tuning](/docs/guide/ai/advanced) — override prompts, temperature, token limits

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
