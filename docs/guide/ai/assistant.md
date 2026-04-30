# AI Assistant

The AI assistant accepts natural language instructions:

```
Add screwdriver to the tools bin
Move batteries to the garage area
Create a bin called Holiday Decorations with items: lights, ornaments, wrapping paper
Remove the extension cord from the electrical bin
Where did I put the holiday lights?
```

OpenBin shows a preview of the action and asks for confirmation before making changes. Search queries return matching bins with an explanation of why each matched.

::: info Where the assistant lives
On desktop (≥ 1024 px) the assistant opens as a command-palette dialog over the current page (default shortcut `Mod+J`). On mobile and narrow screens it opens at the dedicated `/ask` route as a full-page conversation. Both surfaces have the same features.
:::

::: info Conversation memory
Conversations are per-session only. Closing the dialog or navigating away clears the chat. Server-side, history is trimmed to the most recent 10 turns before being sent to the model, so very long sessions gradually drop the earliest exchanges.
:::
