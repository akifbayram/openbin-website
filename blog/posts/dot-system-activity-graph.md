---
blogPost: true
title: "The dot system, automated: QR scans as an activity heatmap"
description: Scott Lawson tracked four years of box-opens with stickers to find cold storage. OpenBin builds the same signal from QR scans, rendered as a daily heatmap.
date: "2026-04-14"
author: akifbayram
tags: [Organization, Activity Tracking, QR Codes, Storage]
cover: /blog/covers/dot-system-activity-graph.webp
---

If you saw [the HN thread](https://news.ycombinator.com/item?id=47593556) on Scott Lawson's [dot system](https://scottlawsonbc.com/post/dot-system) and the comments arguing about whether the dots are the point or the discipline is the point — this is for you.

Scott's article describes a clean analog system: place one colored sticker on a storage box every day you open it, max one per day, and let the color encode the year. After four years of stickers, the dot density on each box becomes a dashboard for what you actually use. Boxes with no recent dots get moved to a "cold" staging area and eventually out the door.

I read the piece and noticed something specific: the dot is a UI for a counter. Replace the dot with a scan event and the same counter shows up in the same shape — a contribution-graph heatmap. That observation was the prompt to actually build it into [OpenBin](https://openbin.app), the open-source bin inventory app I work on. The [usage tracking feature](/docs/guide/usage) that ships now is a direct response to Scott's article. This post is what came out of the build — what dots and scans have in common, what only one of them can do, and where they overlap.

> **Key takeaways**
>
> - The dot system's value is the activity signal, not the stickers themselves
> - A QR scan registers the same "I opened this" event automatically, no sticker required
> - OpenBin renders that data as a daily heatmap with hot, warm, and cold tiers — the same framework Scott uses
> - Dots beat scans on speed of application; scans beat dots on multi-user, history, and "find anything inside"
> - The two systems can run side by side without conflict

## What are the dots actually measuring?

Re-read Scott's piece and you'll notice the rule isn't "track every interaction." It's one dot per box per day, no matter how many times you open it. He's measuring **active days**, not raw frequency. That's the same metric [GitHub displays for commits](https://docs.github.com/en/account-and-profile/concepts/contributions-on-your-profile) — a binary "did anything happen in this 24-hour window?"

After four years, his data flagged the obvious cross-cutting bins (fasteners, glue, USB-C cables, batteries) and the surprising dead weight (the oscilloscope at five dots, the untouched piezoelectric components, M2.5 fasteners losing to ubiquitous M3). The dots didn't tell him anything he couldn't have eventually figured out by introspection. They told him *immediately* and without arguing with his memory.

The three tiers fall out of the data:

- **Hot** — arm's-reach bins with consistent dot coverage
- **Warm** — closet shelves, fewer dots
- **Cold** — a long stretch with no dots, relocated to a staging area, then out

Once you frame it that way, the system is a counter, a dashboard, and a relocation rule. The stickers are the input device.

## A QR scan is a dot

Stick a QR sticker on a bin. Scan it with your phone camera every time you open the box. The scan registers a usage event in the inventory app. End of mechanism.

OpenBin records that event with a timestamp and renders the result as a year-at-a-glance heatmap — the GitHub contribution-graph layout most of you already read fluently. Each bin gets its own heatmap on its detail page, and the dashboard has an aggregate widget that rolls up every bin in the location.

Darker cells mean more activity that day. The weekly and monthly views collapse the same data into per-week or per-month counts if you'd rather see trend over a decade than detail in a single year. Year chips at the top let you flip between recorded years the way Scott compares yellow stickers to blue ones.

<figure style="margin: 2rem 0; text-align: center;">
  <svg viewBox="0 0 560 220" style="max-width: 100%; height: auto; font-family: 'Inter', system-ui, sans-serif" role="img" aria-label="A year-long activity heatmap for a Christmas-lights bin. A cluster of scans in the first two weeks of January from putting decorations away, a handful of isolated dots across spring and summer for occasional access, a ramp-up through November, a peak-intensity install weekend in early December, steady maintenance scans through mid-December, and a small final pack-up dot at year's end.">
    <title>Christmas-lights bin: one year of activity</title>
    <desc>Contribution-graph-style heatmap of OpenBin scan activity for a single Christmas-lights bin across 52 weeks and 7 days, rendered as circular dots with four intensity levels. Activity clusters in early January as decorations are put away, thins to a handful of isolated maintenance and occasional-access scans through spring and summer, ramps up through November as setup begins, peaks in the first weekend of December when the lights are installed, settles into steady maintenance scans through mid-December, and ends with a small pack-up dot at year's end.</desc>
    <defs>
      <pattern id="heatmap-grid" x="30" y="70" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="9" height="9" rx="4.5" fill="currentColor" opacity="0.08"/>
      </pattern>
    </defs>
    <text x="20" y="26" font-size="14" font-weight="700" fill="currentColor">Christmas-lights bin</text>
    <text x="20" y="42" font-size="11" fill="currentColor" opacity="0.55">One year of scans — two busy months, ten quiet ones</text>
    <text x="550" y="42" text-anchor="end" font-size="10" fill="currentColor" opacity="0.4">52 weeks &middot; 1 bin</text>
    <text x="30" y="62" font-size="10" fill="currentColor" opacity="0.55">Jan</text>
    <text x="70" y="62" font-size="10" fill="currentColor" opacity="0.55">Feb</text>
    <text x="110" y="62" font-size="10" fill="currentColor" opacity="0.55">Mar</text>
    <text x="150" y="62" font-size="10" fill="currentColor" opacity="0.55">Apr</text>
    <text x="190" y="62" font-size="10" fill="currentColor" opacity="0.55">May</text>
    <text x="230" y="62" font-size="10" fill="currentColor" opacity="0.55">Jun</text>
    <text x="270" y="62" font-size="10" fill="currentColor" opacity="0.55">Jul</text>
    <text x="310" y="62" font-size="10" fill="currentColor" opacity="0.55">Aug</text>
    <text x="360" y="62" font-size="10" fill="currentColor" opacity="0.55">Sep</text>
    <text x="400" y="62" font-size="10" fill="currentColor" opacity="0.55">Oct</text>
    <text x="440" y="62" font-size="10" fill="currentColor" opacity="0.55">Nov</text>
    <text x="480" y="62" font-size="10" fill="currentColor" opacity="0.55">Dec</text>
    <text x="26" y="84" text-anchor="end" font-size="9" fill="currentColor" opacity="0.5">Mon</text>
    <text x="26" y="104" text-anchor="end" font-size="9" fill="currentColor" opacity="0.5">Wed</text>
    <text x="26" y="124" text-anchor="end" font-size="9" fill="currentColor" opacity="0.5">Fri</text>
    <rect x="30" y="70" width="520" height="70" fill="url(#heatmap-grid)"/>
    <g fill="#5e2fe0" opacity="0.3">
      <rect x="30" y="130" width="9" height="9" rx="4.5"/>
      <rect x="40" y="120" width="9" height="9" rx="4.5"/>
      <rect x="110" y="120" width="9" height="9" rx="4.5"/>
      <rect x="180" y="130" width="9" height="9" rx="4.5"/>
      <rect x="240" y="130" width="9" height="9" rx="4.5"/>
      <rect x="300" y="120" width="9" height="9" rx="4.5"/>
      <rect x="430" y="110" width="9" height="9" rx="4.5"/>
      <rect x="450" y="100" width="9" height="9" rx="4.5"/>
      <rect x="490" y="130" width="9" height="9" rx="4.5"/>
      <rect x="510" y="130" width="9" height="9" rx="4.5"/>
      <rect x="540" y="120" width="9" height="9" rx="4.5"/>
    </g>
    <g fill="#5e2fe0" opacity="0.55">
      <rect x="30" y="120" width="9" height="9" rx="4.5"/>
      <rect x="40" y="130" width="9" height="9" rx="4.5"/>
      <rect x="460" y="110" width="9" height="9" rx="4.5"/>
      <rect x="470" y="120" width="9" height="9" rx="4.5"/>
      <rect x="500" y="120" width="9" height="9" rx="4.5"/>
      <rect x="520" y="110" width="9" height="9" rx="4.5"/>
    </g>
    <g fill="#5e2fe0" opacity="0.8">
      <rect x="50" y="130" width="9" height="9" rx="4.5"/>
      <rect x="480" y="120" width="9" height="9" rx="4.5"/>
      <rect x="490" y="110" width="9" height="9" rx="4.5"/>
      <rect x="510" y="120" width="9" height="9" rx="4.5"/>
    </g>
    <g fill="#5e2fe0">
      <rect x="480" y="130" width="9" height="9" rx="4.5"/>
      <rect x="490" y="120" width="9" height="9" rx="4.5"/>
      <rect x="500" y="130" width="9" height="9" rx="4.5"/>
    </g>
    <g transform="translate(30, 168)" font-size="10" fill="currentColor">
      <text x="0" y="8" opacity="0.5">Empty rows = cold storage candidates</text>
    </g>
    <g transform="translate(410, 160)">
      <text x="0" y="8" font-size="10" fill="currentColor" opacity="0.5">Less</text>
      <rect x="28" y="0" width="9" height="9" rx="4.5" fill="currentColor" opacity="0.08"/>
      <rect x="40" y="0" width="9" height="9" rx="4.5" fill="#5e2fe0" opacity="0.3"/>
      <rect x="52" y="0" width="9" height="9" rx="4.5" fill="#5e2fe0" opacity="0.55"/>
      <rect x="64" y="0" width="9" height="9" rx="4.5" fill="#5e2fe0" opacity="0.8"/>
      <rect x="76" y="0" width="9" height="9" rx="4.5" fill="#5e2fe0"/>
      <text x="92" y="8" font-size="10" fill="currentColor" opacity="0.5">More</text>
    </g>
    <text x="280" y="206" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.35">Illustrative OpenBin activity log</text>
  </svg>
</figure>

The aggregate heatmap doubles as a cold-tier prompt: empty rows and fading dots jump out, and sorting the bin list by last-used date surfaces the candidates for relocation. That's the same decision Scott makes when he eyes a thinly-dotted box, just with the cutoff parameterized to whatever duration fits your situation.

A few HN commenters argued for stack order (LRU) as the lowest-friction tracking method — what's at the front of the shelf is what you used last. That works for ten boxes. Past that, the "stack" turns into a row, the row turns into a wall, and the front of the wall is just where the first box ended up.

## Where do dots beat scans?

I want to be specific about this because the HN comments are right that physical systems have real advantages.

**Application speed.** Slap a sticker on a box, done. With a phone you have to wake the screen, point the camera, wait for the focus, sometimes type a quick note. For someone who already has the box open and their hands free, the sticker is faster.

**Reflective effort.** Scott mentions this implicitly. Selecting a sticker and placing it is small enough to be effortless and large enough to be deliberate. A scan is more passive — you wave your phone, you get a hit. The act of marking a box with your hand is harder to do absent-mindedly.

**No phone needed.** Workshops, garages, attics, basements. Plenty of contexts where you don't want to fish your phone out of a back pocket. Stickers don't care.

**No infrastructure.** Three dollars of stickers and a Sharpie. No server, no app, no migration risk in 2030 when whatever app you used got acquired and shut down.

If your storage problem is a single workshop with a single user and you already have label sheets at every workbench corner, the dot system might actually be the right tool. Scott's not wrong to recommend it.

## Where do scans beat dots?

Several things become hard or impossible with stickers and trivial with a scan log.

**More than one user.** A shared garage with four people will produce dot density that reflects whoever remembers to apply stickers, which is usually nobody. With a phone-camera scan, anyone in the household who's looking for something registers the access automatically. Their use counts whether or not they care about your tracking system.

**Year-over-year comparison without recoloring.** Scott's color scheme works for a decade. After that you're either out of distinguishable colors or relying on a printed reference card. A timestamp doesn't have that problem.

**The contents of the box.** A dot tells you "this box gets used." It doesn't tell you what's in it. A scan opens a page with the item list, photos, and tags. Half the reason to open the box was to find something — the scan can answer "what's in there?" before you open it. (See the full walkthrough at [How to keep track of what's in every storage bin](/blog/posts/storage-bin-tracking).)

**Filtering and sorting.** "Show me every bin in the basement that hasn't been scanned since last September and contains anything tagged 'electronics'" is a query you can run. Counting dots by hand to answer the same question is the kind of project that ends with you giving up halfway and ordering pizza.

**Export.** OpenBin exports your bin data to CSV, JSON, or ZIP, and raw scan events are available through the scan-history API. Stickers don't export.

**Audit trail.** When something walks off, the scan history shows who touched the bin and when. Not relevant for most homes, very relevant for shared workshops, makerspaces, or households with kids and contractors coming through.

None of this is to say the digital approach is universally better. It says the two systems trade different things.

## What should "use" actually count as?

This is the question one HN commenter framed well: a bin you don't open isn't necessarily a bin you don't need. The ice cream maker on the shelf is the example. Scott handles this by exempting "obviously essential tools" from the dotting protocol — focus on ambiguous cases.

OpenBin handles it by letting you choose which actions count. There are four togglable signals in **Settings → Preferences → Usage Tracking**:

- **Scan QR code** (on by default) — physical scan of the QR label on a bin
- **Manual code lookup** (on by default) — typing the bin's short code into the app
- **View bin** (off by default) — opening the bin's detail page
- **Modify bin** (on by default) — adding, removing, or editing items in the bin

The defaults cover events that imply you're actually at the bin or changing its contents — scanning, punching in the code, or editing what's inside. Passive page views are off so that clicking around the app doesn't inflate the count. Flip any switch if your workflow differs.

The escape hatch for the ice-cream-maker problem is the same as Scott's: don't move a bin to cold storage just because the heatmap is empty. The data is a prompt for a decision, not the decision itself.

## How do you run both systems at once?

If you've already got Scott's system going, you don't have to throw out the stickers to add a heatmap. Print a QR sheet, stick a code on each box next to the dot column, and start scanning. The next time you open a box, you do both — sticker and scan. After three months you'll know which one you actually maintain. That's a useful experiment in itself.

The other direction works too. If you start digital and feel like the heatmap is too remote from the physical objects, add a sticker column. Some people need the tactile feedback to internalize the data.

The point of either system is to surface the gap between what you think you use and what you actually use. The mechanism is downstream of that.

## How do you set up the heatmap in OpenBin?

If you want the digital version:

1. Sign up at [openbin.app](https://openbin.app), or [self-host with Docker](/docs/getting-started/docker) — single container, runs on a Pi.
2. Create a location and add some bins. The [bins guide](/docs/guide/bins) covers the full setup.
3. Print QR labels for each bin and stick them on. Any standard label paper works.
4. Open Settings → Preferences → Usage Tracking and confirm which signals count. The full reference is in the [usage tracking docs](/docs/guide/usage) — defaults are scan, manual code lookup, and modify.
5. Scan each bin when you open it. The heatmap fills in over the next few weeks.
6. Scan the dashboard widget for dim rows, or sort your bin list by last-used date to surface cold-tier candidates.

The heatmap shows up in two places: each individual bin's detail page (per-bin view) and the dashboard (aggregate across every bin in the location). Both let you switch between daily, weekly, and monthly granularity, and both have a year selector.

## Frequently asked questions

### Does scanning a bin to add an item count as use?

Yes. The scan event is recorded regardless of why you scanned. By default the edit itself also counts (the Modify toggle is on) — flip it off in preferences if you only want physical-interaction events to register.

### Can I see usage at the item level instead of the bin level?

Not yet. The dot system measures box-opens, not item-uses, and OpenBin matches that. Per-item tracking would require tagging individual items as you remove them, which crosses the line from low-friction signal collection into full inventory management.

### Can I export the activity data?

Your bin data exports as CSV, JSON, or ZIP from **Settings → Data**. Raw scan events are available via the [scan-history API](/docs/api/scan-history) if you want to do your own analysis.

### Doesn't this need everyone in the house to actually scan?

Yes, and so does Scott's system need everyone to apply stickers. The advantage of the scan is that anyone looking for an item is already opening the app to search — the scan happens at the same gesture, not as a separate discipline. The dot requires a separate, deliberate action after you've already gotten what you came for.

## Dots and heatmaps are measuring the same thing

Scott's article is doing real work. [Storable and SpareFoot's 2025 Real Cost of Clutter report found 54% of Americans sacrifice 100–500 square feet of their home to possessions they rarely use, and 21% give up more than 500 square feet — roughly $113,500 in real-estate value at median home prices](https://www.prnewswire.com/news-releases/storable-and-sparefoot-release-the-real-cost-of-clutter-report-reveals-americans-pay-up-to-113-500-in-hidden-clutter-tax-on-their-homes-302428168.html). Cold-tier bins add up, and the first step in getting any of that square footage back is being able to identify them. The system is small enough to maintain, visual enough to read at a glance, and structured enough to drive decisions about what to keep. The HN argument over whether dots are silly or brilliant is missing that the dots are an interface, and the interesting thing is the data behind the interface.

If you have a workshop and you want the analog thing, do the analog thing. If you have a household with shared bins, year-over-year history, and a need to actually find what's in each box, the same data wants a different interface.

[Sign up at openbin.app](https://openbin.app) — free tier covers 10 bins, the self-hosted version has no limits.
