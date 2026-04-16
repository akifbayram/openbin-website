---
blogPost: true
title: How to organize craft supplies when you have way too many
description: 71% of US consumers identify as crafters. Most of them have supplies in bins they haven't opened in years. Here's a system that makes your stash searchable.
date: "2026-03-03"
author: akifbayram
tags: [Organization, QR Codes, Crafts]
cover: /blog/covers/craft-supply-organization.webp
---

You know you have that teal worsted-weight yarn somewhere. You bought it two years ago for a blanket you never started. It's in one of the bins in the closet, or maybe the shelf in the spare room, or possibly the bag under the sewing table. You spend fifteen minutes looking, give up, and order another skein online.

If you've ever bought duplicate supplies because you couldn't find what you already had, this is for you. I'll walk through a system for organizing craft supplies using QR code labels and a searchable inventory app.

> **Key takeaways**
>
> - QR labels on supply bins let you scan to see exactly what's inside
> - AI photo recognition catalogs yarn, fabric, beads, and paint without manual entry
> - Search across all your bins for a specific color, weight, or material
> - The system works whether your stash fills a shelf or an entire room

## Why do crafters have a unique organization problem?

Craft supplies accumulate in a way that most household items don't. Yarn comes home from every shop visit. Fabric gets bought for projects that change scope. Beads, buttons, zippers, and notions multiply quietly in drawers.

According to Mintel, 71% of US consumers identify as crafters. The North American craft market is worth $17.8 billion. That's a lot of material going into storage.

A Craft Industry Alliance survey found that yarn crafters start an average of 19 projects per year and complete 16. The remaining three become UFOs — unfinished objects — with their associated yarn stashed somewhere until you get back to them. Multiply that by a few years and you've got a closet full of bins where you vaguely know the contents but can't find anything specific.

<figure style="margin: 2rem 0; text-align: center;">
  <svg viewBox="0 0 560 380" style="max-width: 100%; height: auto; font-family: 'Inter', system-ui, sans-serif" role="img" aria-label="Horizontal bar chart showing yarn crafters start 19 projects per year, complete 16, and leave 3 as unfinished objects">
    <title>The UFO problem: yarn projects started vs completed</title>
    <desc>Horizontal bar chart showing the annual project outcomes for the average yarn crafter. 19 projects are started per year, 16 are completed, and 3 are left unfinished as UFOs (unfinished objects). Source: Craft Industry Alliance Yarn Consumer Survey 2025.</desc>
    <text x="20" y="28" font-size="14" font-weight="700" fill="currentColor">The UFO problem: yarn projects started vs completed</text>
    <text x="20" y="44" font-size="11" fill="currentColor" opacity="0.45">Per yarn crafter, per year (U.S. average)</text>
    <line x1="180" y1="70" x2="180" y2="290" stroke="currentColor" opacity="0.3" />
    <line x1="260" y1="70" x2="260" y2="290" stroke="currentColor" opacity="0.08" />
    <line x1="340" y1="70" x2="340" y2="290" stroke="currentColor" opacity="0.08" />
    <line x1="420" y1="70" x2="420" y2="290" stroke="currentColor" opacity="0.08" />
    <line x1="500" y1="70" x2="500" y2="290" stroke="currentColor" opacity="0.08" />
    <text x="260" y="310" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.5">5</text>
    <text x="340" y="310" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.5">10</text>
    <text x="420" y="310" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.5">15</text>
    <text x="500" y="310" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.5">20</text>
    <text x="172" y="119" text-anchor="end" font-size="12" fill="currentColor" opacity="0.8">Started</text>
    <rect x="180" y="95" width="304" height="40" fill="#38bdf8" />
    <text x="495" y="119" font-size="12" font-weight="700" fill="currentColor">19</text>
    <text x="172" y="189" text-anchor="end" font-size="12" fill="currentColor" opacity="0.8">Completed</text>
    <rect x="180" y="165" width="256" height="40" fill="#22c55e" />
    <text x="447" y="189" font-size="12" font-weight="700" fill="currentColor">16</text>
    <text x="172" y="259" text-anchor="end" font-size="12" fill="currentColor" opacity="0.8">UFOs (unfinished)</text>
    <rect x="180" y="235" width="48" height="40" fill="#f97316" />
    <text x="239" y="259" font-size="12" font-weight="700" fill="currentColor">3</text>
    <text x="280" y="372" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.35">Source: Craft Industry Alliance Yarn Consumer Survey (2025)</text>
  </svg>
</figure>

The crafter term for this is SABLE: Stash Acquisition Beyond Life Expectancy. It's a joke, but it describes a real problem. You own more material than you can track mentally, and every standard organization method — labels, memory, "I'll just remember" — breaks once the stash gets past a certain size.

## The problem with existing solutions

Most craft organization advice is physical: buy clear bins, use label makers, get a peg board, sort by color. That's fine for a small collection. It falls apart when your stash spans 20+ bins across multiple rooms.

Ravelry's built-in stash tracker works for yarn specifically, but it's text-only, manual entry, and limited to one platform. It doesn't help you find the bin in your closet. Craftybase handles inventory for businesses selling products, not for personal stash management.

The gap is this: no existing tool connects a physical bin of supplies to a scannable, searchable, photographic inventory that works across all craft types.

That's what QR labels + an inventory app solve. For a detailed explanation of how QR bin tracking works in general, see [how to keep track of what's in every storage bin](/blog/posts/storage-bin-tracking). This post focuses on the craft-specific setup.

## How do you set up a craft stash inventory?

[OpenBin](https://openbin.app) is a free, open-source inventory app I built for bin-based storage. Here's how to set it up for craft supplies.

**Create areas by storage location.** "Craft Room — Shelf," "Closet — Top Shelf," "Under Sewing Table." Match the areas to where bins physically live so you can find them.

**Create bins by category or material type.** How you split this depends on your craft. Some options:

- By material: yarn bin, fabric bin, notions bin, paper bin
- By project: bins for each active WIP, one for project-ready kits
- By color family: reds and oranges in one bin, blues and greens in another
- By weight/type: fingering-weight yarn, worsted, bulky, cotton vs. wool

Pick whatever matches how you actually search for things. If you think "I need blue fabric," organize by color. If you think "I need worsted-weight," organize by weight.

**Photograph each bin.** Open it, snap a photo. OpenBin's [AI photo recognition](/docs/guide/ai) identifies supplies from the image — "teal yarn skein," "red cotton fabric," "wooden knitting needles." You review, tweak the descriptions, and save. This is where the time savings are biggest. A bin of thirty yarn skeins would take five minutes to type out. The AI handles it in seconds.

**Print QR labels.** Generate a [label sheet](/docs/guide/print-labels), print on any label paper, stick one on each bin. Scan a bin's QR code from your phone and you see its full contents with photos.

**Search for anything.** This is the payoff. Type "teal worsted" into the search bar. Get back "Craft Room — Shelf 2, Bin 4." Go straight to it.

![Yarn stash bin inventory showing merino wool, alpaca, cotton, and sock yarn skeins with craft tags](/blog/inline/yarn-stash-bin-detail.webp)

## Why does photo recognition matter for craft supplies?

Craft supplies are visual. You choose yarn by color and texture, not just by name. A text list that says "green yarn, 2 skeins" is less useful than a photo showing exact shade, brand, and how much is left on the skein.

OpenBin stores photos alongside the item list. When you scan a QR label or search for something, you see the photo you took when you packed the bin. This answers the question that text descriptions can't: "is this the green I'm looking for, or a different green?"

The photo recognition works with OpenAI, Anthropic, or Google Gemini. It identifies common supplies, yarn brands, fabric types, and tools. It's not going to tell you the exact dye lot, but it gets close enough that you know whether to dig into that bin.

## Stash-busting with data

Here's something that changes how you shop for supplies. When you can search your entire stash from your phone, you check before you buy. Standing in a yarn shop wondering if you already have a bulky blue? Search "bulky blue" and find out in five seconds.

Crafters call this stash-busting — using what you have instead of buying more. An inventory makes it practical. You know exactly what you own, what colors you have, and how much of each. You stop buying duplicates and start finishing projects with supplies you forgot about.

After JOANN closed all 800 of its stores in early 2025, more crafters shifted to online buying, which means less impulse browsing and more "I need to order the right thing." Having an inventory of what you already own makes that easier.

If your stash skews seasonal — handmade ornaments, Halloween costume fabric, holiday wreath supplies — the [Christmas decoration storage guide](/blog/posts/christmas-decoration-storage) covers the once-a-year-storage problem that seasonal crafts share with holiday decor.

## Frequently asked questions

### Does this work for small supplies like beads and buttons?

Yes. Bin-based inventory works at any scale. A bin of sorted bead containers gets a QR label just like a bin of yarn. The photo shows what's inside, and the item list captures specifics. For tiny items, the photos are more useful than the text.

### Can I share access with my crafting group?

OpenBin supports [multiple users](/docs/guide/locations) per location. If you share a studio or a maker space, everyone can search the shared inventory from their own phone.

### What if I reorganize my supplies?

Update the bin contents in the app. The QR sticker stays. The inventory reflects whatever's currently inside. Reorganize as often as you want without relabeling.

### Is OpenBin free?

Yes. [Free cloud tier](/cloud) or self-host with Docker. Open source (AGPL-3.0) on [GitHub](https://github.com/akifbayram/openbin).

## Your stash isn't the problem

Having too many supplies isn't the issue. Not knowing what you have is. A searchable, photo-backed inventory turns a chaotic stash into a resource you actually use.

[Sign up free at openbin.app](https://openbin.app). Takes about 30 seconds.

---

**Sources:** [Mintel/US Chamber of Commerce Crafts Market Report, 2025](https://www.uschamber.com/co/good-company/launch-pad/stress-fuels-crafts-market) · [Craft Industry Alliance Yarn Consumer Survey, 2025](https://craftindustryalliance.org/the-size-of-the-yarn-market-yarn-consumer-survey-results-2025/) · [NPR — JOANN Closing All Stores, 2025](https://www.npr.org/2025/02/25/nx-s1-5307907/joann-closing-stores-bankruptcy) · [NBC News — JOANN to Shutter 800 Fabric Stores, 2025](https://www.nbcnews.com/business/business-news/joann-shutter-800-fabric-stores-find-buyer-locations-rcna193536)
