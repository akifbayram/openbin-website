---
blogPost: true
title: How to organize a board game collection past the shelf
description: 5,314 tabletop games were funded on Kickstarter in 2024. When the Kallax fills up, a QR-based system tracks overflow, expansions, and shared collections.
date: "2026-01-31"
author: akifbayram
tags: [Organization, QR Codes, Board Games]
cover: /blog/covers/board-game-collection-storage.webp
---

There's a specific moment in every board game collection where shelving stops working. The [Kallax](https://www.ikea.com/us/en/cat/kallax-series-27534/) is full. The expansion boxes are stacked on top, leaning against the wall. There are games in the closet, games in the garage, and a Kickstarter delivery on the way that needs to go somewhere.

[Over 5,000 tabletop games were funded on Kickstarter in 2024 alone, raising $220 million](https://updates.kickstarter.com/kickstarter-biggest-platform-for-games/). The [global board game market is worth nearly $16 billion and growing more than 10% per year](https://www.fortunebusinessinsights.com/board-games-market-104972). Collections are getting bigger, and the storage problem is getting worse.

<figure style="margin: 2rem 0; text-align: center;">
  <svg viewBox="0 0 560 380" style="max-width: 100%; height: auto; font-family: 'Inter', system-ui, sans-serif" role="img" aria-label="Line chart showing the global board game market growing from 16 billion dollars in 2024 to a projected 25.8 billion by 2029 at 10 percent compound annual growth">
    <title>Global board game market growth, 2024 to 2029</title>
    <desc>Line chart with area fill showing the global board game market projection at approximately 10 percent compound annual growth rate: 16.0 billion in 2024, 17.6 billion in 2025, 19.4 billion in 2026, 21.3 billion in 2027, 23.4 billion in 2028, and 25.8 billion by 2029. Source: Fortune Business Insights, 2025.</desc>
    <text x="70" y="28" font-size="14" font-weight="700" fill="currentColor">Global board game market growth, 2024-2029</text>
    <text x="70" y="44" font-size="11" fill="currentColor" opacity="0.55">Projected at 10% compound annual growth rate ($ billions)</text>
    <line x1="70" y1="290" x2="510" y2="290" stroke="currentColor" opacity="0.45" />
    <line x1="70" y1="224" x2="510" y2="224" stroke="currentColor" opacity="0.1" />
    <line x1="70" y1="159" x2="510" y2="159" stroke="currentColor" opacity="0.1" />
    <line x1="70" y1="93" x2="510" y2="93" stroke="currentColor" opacity="0.1" />
    <line x1="66" y1="290" x2="70" y2="290" stroke="currentColor" opacity="0.45" />
    <line x1="66" y1="224" x2="70" y2="224" stroke="currentColor" opacity="0.45" />
    <line x1="66" y1="159" x2="70" y2="159" stroke="currentColor" opacity="0.45" />
    <line x1="66" y1="93" x2="70" y2="93" stroke="currentColor" opacity="0.45" />
    <text x="62" y="294" text-anchor="end" font-size="10" fill="currentColor" opacity="0.6">$14B</text>
    <text x="62" y="228" text-anchor="end" font-size="10" fill="currentColor" opacity="0.6">$18B</text>
    <text x="62" y="163" text-anchor="end" font-size="10" fill="currentColor" opacity="0.6">$22B</text>
    <text x="62" y="97" text-anchor="end" font-size="10" fill="currentColor" opacity="0.6">$26B</text>
    <path d="M70,257 L158,231 L246,201 L334,170 L422,135 L510,95 L510,290 L70,290 Z" fill="#5e2fe0" opacity="0.18" />
    <polyline points="70,257 158,231 246,201 334,170 422,135 510,95" fill="none" stroke="#5e2fe0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.95" />
    <circle cx="70" cy="257" r="4" fill="#5e2fe0" />
    <circle cx="158" cy="231" r="4" fill="#5e2fe0" />
    <circle cx="246" cy="201" r="4" fill="#5e2fe0" />
    <circle cx="334" cy="170" r="4" fill="#5e2fe0" />
    <circle cx="422" cy="135" r="4" fill="#5e2fe0" />
    <circle cx="510" cy="95" r="4" fill="#5e2fe0" />
    <text x="82" y="252" text-anchor="start" font-size="10" font-weight="700" fill="currentColor">$16.0B</text>
    <text x="498" y="87" text-anchor="end" font-size="10" font-weight="700" fill="currentColor">$25.8B</text>
    <text x="70" y="310" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.6">2024</text>
    <text x="158" y="310" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.6">2025</text>
    <text x="246" y="310" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.6">2026</text>
    <text x="334" y="310" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.6">2027</text>
    <text x="422" y="310" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.6">2028</text>
    <text x="510" y="310" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.6">2029</text>
    <text x="280" y="360" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.45">Source: Fortune Business Insights (2025), 10% CAGR projection</text>
  </svg>
</figure>

BoardGameGeek tracks what you own. It doesn't tell you where it is. This post covers a system for tracking a board game collection across shelves, bins, and overflow storage using QR code labels and a free inventory app.

> **Key takeaways**
>
> - QR labels on bins and shelves let you scan to see what's stored there
> - Track which bin holds an expansion and which has the base game
> - AI photo recognition catalogs game boxes and components from a photo
> - Search the whole collection from your phone: "where's the Catan expansion?"

## The real problem: expansions and overflow

When everything fits on a Kallax, you can eyeball the spines and find what you need. The system breaks when games overflow into bins.

Bins are the most common overflow solution. You consolidate expansions into the base game box, toss the empty expansion boxes, and stack the consolidated games into labeled totes. Or you bag smaller games together by category. Either way, you lose the ability to see what's where at a glance.

The expansion problem is the worst part. A game with two expansions might be stored as: base game box on the shelf (with expansion 1 components inside), expansion 2 components in a bin labeled "overflow — medium games," and the rulebook for expansion 2 in a different bin because it didn't fit. Good luck reassembling that for game night.

[About 1 in 10 board game hobbyists own more than 100 titles](https://icon-era.com/statistics/board-game-sales-statistics/). At that scale, memory-based organization stops working. And the "shelf of shame" — games you've bought but never played — keeps growing while you forget what you already own.

## What doesn't BoardGameGeek solve for storage?

BoardGameGeek's collection tracker is the standard for logging what you own. [300,000 active users](https://en.wikipedia.org/wiki/BoardGameGeek) track ratings, plays, and wishlists there. But BGG tells you "I own Wingspan" — it doesn't tell you "Wingspan is in Bin 3 on the garage shelf, with the European expansion inside the base box and the Oceania expansion in Bin 5."

BG Stats tracks plays. MeepleStats tracks plays. Board Game Arena tracks plays. None of them track physical storage locations.

The gap is between "what do I own" and "where is it, specifically, right now." QR labels fill that gap.

For a detailed walkthrough of how QR bin tracking works in general, see [how to keep track of what's in every storage bin](/blog/posts/storage-bin-tracking). Here I'll focus on what's specific to board game collections.

## How do you set up a board game inventory?

[OpenBin](https://openbin.app) is a free, open-source inventory app I built for physical storage tracking. It works well for collections that span multiple storage locations.

**Map your storage zones.** Create areas for everywhere games live: "Living Room — Kallax," "Closet — Top Shelf," "Garage — Bin Shelving." If you have a dedicated game room, break it into sections.

**Create a bin for each physical container.** This includes actual bins, but also shelf sections if you think of them that way. A Kallax cube is effectively a bin. A tote in the garage is a bin. Each one gets an entry in the app.

**Log the games in each bin.** List what's inside. For shelf sections, that's game titles. For overflow bins, include which components are there. "Catan — base game + Seafarers expansion, all components" vs. "Catan — Cities & Knights expansion, cards and tokens only, rulebook in Bin 6."

Specificity matters here more than in other storage categories. Knowing a game is "in the garage" isn't enough. Knowing that expansion components are split across two bins is the information that actually saves you time on game night.

**Use photo recognition for bins of components.** Open a bin full of bagged game components, snap a photo, and OpenBin's [AI photo recognition](/docs/guide/ai) identifies what it sees. It picks up game box art, component types, and card backs. For mixed bins, this is faster than typing out every item.

**Print QR labels.** Generate a [label sheet](/docs/guide/print-labels), stick one on each bin, shelf section, or tote. Scan to see contents. Search across everything.

![Board game collection bin showing Catan, Ticket to Ride, Scrabble, Monopoly, and checkout history](/blog/inline/board-game-bin-detail.webp)

## The game night search

Here's the scenario this solves. Someone suggests Twilight Imperium. You know you own it, but it's not on the main shelf. You search "Twilight Imperium" on your phone and get: "Garage — Bin 7, top shelf. Includes base game + Prophecy of Kings expansion. All components confirmed." You walk straight to it.

Or someone asks if you have a good two-player game. You [search by tag](/docs/guide/items-tags) — "2-player" — and get every game you've tagged that way, with bin locations.

This is what BGG's collection tracker could do if it knew where your games physically lived. OpenBin bridges that gap.

## How do you share a collection with a game group?

If you host regularly, your friends probably want to browse what you own. OpenBin supports [multiple users](/docs/guide/locations) per location. Invite your game group as viewers. They can search your collection from their own phones and come to game night with a request instead of a question.

For shared collections — game cafes, board game libraries, club collections — the member role lets multiple people update the inventory as games get moved around.

If you want to compare OpenBin to other bin-tracking options before committing, see [7 apps for tracking what's in your storage bins, compared](/blog/posts/best-storage-bin-tracking-apps).

## Frequently asked questions

### Should I scan individual game boxes or storage bins?

Both work. For the Kallax, treating each cube as a "bin" makes sense. For overflow totes, scan the tote. Mix approaches based on how you actually store things.

### Can I track what's inside a game box (components, sleeves, inserts)?

Yes. Each bin entry has an item list and notes field. You can log "base game cards (sleeved), expansion cards (unsleeved), custom insert from Folded Space, 6 resource bags." As detailed as you want.

### What about tracking plays or ratings?

OpenBin tracks storage, not gameplay. Keep using BGG or BG Stats for play tracking. They solve different problems.

### Is OpenBin free?

Yes. [Free cloud tier](/cloud) or self-host with Docker — a single container that runs on a Raspberry Pi. Open source (AGPL-3.0) on [GitHub](https://github.com/akifbayram/openbin).

## The collection isn't going to stop growing

You know that. I know that. Another Kickstarter campaign will launch next week and it'll look incredible. The question isn't whether you'll buy more games — it's whether you'll be able to find them when you want to play.

[Sign up free at openbin.app](https://openbin.app).
