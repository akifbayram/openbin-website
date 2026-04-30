# Custom Prompts & Tuning

## Custom Prompts

Advanced users can override the default AI prompts for each operation:

1. Go to **Settings → AI → Custom Prompts**.
2. Select a task tab and enter a custom prompt. There are six tabs:
   - **Photo Analysis** — guides the bin-name and items suggestions from photos.
   - **Commands** — classifies user commands and plans the resulting actions.
   - **Queries** — answers "where is X" style questions.
   - **Extraction** — structures dictated or pasted text into items.
   - **Reorganize** — guides bulk reorganization (e.g. "group by room").
   - **Tag Suggestion** — proposes new or improved tags for existing bins.
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
