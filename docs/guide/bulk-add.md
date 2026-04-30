# Bulk Add

Create multiple bins at once from photos. Drag photos into groups (one group per bin), let AI suggest names and contents for each group, then create them all in a batch.

The flow has four steps: **Photos → AI → Review → Create**, indicated by the stepper at the top of the page.

## Step 1 — Photos (group)

Upload your photos. Each photo starts in its own group. Drag photos between tiles to merge them into a single group, or split a group back out if you grouped photos by mistake.

- One group becomes one bin.
- A group can hold up to **5 photos**, all attached to the same resulting bin.
- Each group can be assigned its own **area** during this step, with a shared fallback at the top.

When the grouping looks right, advance to the next step.

## Step 2 — AI

If an AI provider is configured, OpenBin analyzes each group's photos together and proposes a bin name, an item list (with quantities when clearly countable), and any matching custom-field values. Tags and notes are not AI-generated; you fill those in during Review.

If AI isn't configured (or is temporarily unavailable), you skip straight to Review with empty suggestions and fill everything in by hand.

::: tip
Bulk Add works without AI, but it's most useful when the AI is doing the recognition work. With a provider configured, you can label a closet of bins in a few minutes. See [AI Overview](/docs/guide/ai/) for setup.
:::

## Step 3 — Review

Step through each group one at a time. For the current group you can:

- Edit the proposed name and items (add, remove, rename, adjust quantity).
- Add tags and notes (user input, not AI suggestions).
- Adjust the area for this specific group.
- Skip the group; it won't be created, but the photos stay in the staging area.
- Re-run AI if the first suggestion was off.

Use the previous/next controls to move between groups.

## Step 4 — Create

Confirm the summary and tap **Create**. Each group becomes a bin with the reviewed name, items, tags, notes, area, and custom-field values. The photos for each group are uploaded and attached to their respective bin.

## Requirements

- Member or admin role; viewers cannot use Bulk Add.
- An AI provider for the auto-analysis step (otherwise you fill in everything manually). See [AI Overview](/docs/guide/ai/).
- Photos follow the same format and size limits as regular bin photos. See [Photos](/docs/guide/photos).
