---
blogPost: true
title: "The dot system, automated: QR scans as an activity heatmap"
description: Scott Lawson tracked four years of box-opens with stickers to find cold storage. OpenBin builds the same signal from QR scans, rendered as a daily heatmap.
date: "2026-04-14"
author: akifbayram
tags: [Organization, Activity Tracking, QR Codes, Storage]
cover: /blog/covers/openbin-dashboard-bin-inventory.webp
---

If you saw [the HN thread](https://news.ycombinator.com/item?id=47593556) on Scott Lawson's [dot system](https://scottlawsonbc.com/post/dot-system) and the comments arguing about whether the dots are the point or the discipline is the point — this is for you.

Scott's article describes a clean analog system: place one colored sticker on a storage box every day you open it, max one per day, and let the color encode the year. After four years of stickers, the dot density on each box becomes a dashboard for what you actually use. Boxes with no recent dots get moved to a "cold" staging area and eventually out the door.

I read the piece and noticed something specific: the dot is a UI for a counter. Replace the dot with a scan event and the same counter shows up in the same shape — a contribution-graph heatmap. That observation was the prompt to actually build it into [OpenBin](https://openbin.app), the open-source bin inventory app I work on. The activity graph that ships now is a direct response to Scott's article. This post is what came out of the build — what dots and scans have in common, what only one of them can do, and where they overlap.

> **Key takeaways**
>
> - The dot system's value is the activity signal, not the stickers themselves
> - A QR scan registers the same "I opened this" event automatically, no sticker required
> - OpenBin renders that data as a daily heatmap with hot, warm, and cold tiers — the same framework Scott uses
> - Dots beat scans on speed of application; scans beat dots on multi-user, history, and "find anything inside"
> - The two systems can run side by side without conflict

## What are the dots actually measuring?

Re-read Scott's piece and you'll notice the rule isn't "track every interaction." It's one dot per box per day, no matter how many times you open it. He's measuring **active days**, not raw frequency. That's the same metric [GitHub displays for commits](https://docs.github.com/en/account-and-profile/concepts/contributions-on-your-profile) — a binary "did anything happen in this 24-hour window?" GitHub timestamps contributions in UTC, not your local time zone, which is the same convention OpenBin uses for the activity log.

After four years, his data flagged the obvious cross-cutting bins (fasteners, glue, USB-C cables, batteries) and the surprising dead weight (the oscilloscope at five dots, the untouched piezoelectric components, M2.5 fasteners losing to ubiquitous M3). The dots didn't tell him anything he couldn't have eventually figured out by introspection. They told him *immediately* and without arguing with his memory.

The three tiers fall out of the data:

- **Hot** — arm's-reach bins with consistent dot coverage
- **Warm** — closet shelves, fewer dots
- **Cold** — two years without a dot, relocated to a staging area, then out

Once you frame it that way, the system is a counter, a dashboard, and a relocation rule. The stickers are the input device.

## A QR scan is a dot

Stick a QR sticker on a bin. Scan it with your phone camera every time you open the box. The scan registers a usage event in the inventory app. End of mechanism.

OpenBin records that event by date in UTC and renders the result as a year-at-a-glance heatmap — the GitHub contribution-graph layout most of you already read fluently. Each bin gets its own heatmap. The location (your garage, attic, basement) gets an aggregate one that sums across every bin in it.

Intensity in the daily view maps roughly to: 0 scans (empty), 1 scan (light), 2-3 scans (medium), 4+ scans (full). The weekly and monthly views collapse the same data into "active days per week" or "active days per month" if you'd rather see trend over a decade than detail in a single year. There's a year pager at the top so you can compare 2024 to 2025 the way Scott compares yellow stickers to blue ones.

<figure style="margin: 2rem 0; text-align: center;">
  <svg viewBox="0 0 560 200" style="max-width: 100%; height: auto; font-family: 'Inter', system-ui, sans-serif" role="img" aria-label="A year-long activity heatmap for a Christmas-lights bin. Two dots in the first week of January from putting decorations away. Ten months of zero activity. Two small dots in mid-November and late November as setup begins. A dark cluster in the first weekend of December when the lights are installed. A few faint dots through the rest of December.">
    <title>Christmas-lights bin: one year of activity</title>
    <desc>Contribution-graph-style heatmap of OpenBin scan activity for a single Christmas-lights bin across 52 weeks and 7 days, rendered as circular dots. Activity concentrates at the two ends of the year: a pair of dots in early January as decorations are put away, then roughly ten months with zero activity, then a small planning dot in mid-November, a darker Saturday around Thanksgiving, a peak-intensity install weekend in the first week of December, and a few faint maintenance dots before a final pack-up dot at the end of December.</desc>
    <defs>
      <pattern id="heatmap-grid" x="30" y="60" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="9" height="9" rx="4.5" fill="currentColor" opacity="0.1"/>
      </pattern>
    </defs>
    <text x="20" y="28" font-size="14" font-weight="700" fill="currentColor">Christmas-lights bin: one year of scans</text>
    <text x="20" y="44" font-size="11" fill="currentColor" opacity="0.45">Each dot is one day of scan activity — January teardown, December install</text>
    <text x="30" y="56" font-size="10" fill="currentColor" opacity="0.6">Jan</text>
    <text x="70" y="56" font-size="10" fill="currentColor" opacity="0.6">Feb</text>
    <text x="110" y="56" font-size="10" fill="currentColor" opacity="0.6">Mar</text>
    <text x="160" y="56" font-size="10" fill="currentColor" opacity="0.6">Apr</text>
    <text x="200" y="56" font-size="10" fill="currentColor" opacity="0.6">May</text>
    <text x="240" y="56" font-size="10" fill="currentColor" opacity="0.6">Jun</text>
    <text x="280" y="56" font-size="10" fill="currentColor" opacity="0.6">Jul</text>
    <text x="330" y="56" font-size="10" fill="currentColor" opacity="0.6">Aug</text>
    <text x="370" y="56" font-size="10" fill="currentColor" opacity="0.6">Sep</text>
    <text x="410" y="56" font-size="10" fill="currentColor" opacity="0.6">Oct</text>
    <text x="460" y="56" font-size="10" fill="currentColor" opacity="0.6">Nov</text>
    <text x="500" y="56" font-size="10" fill="currentColor" opacity="0.6">Dec</text>
    <text x="24" y="68" text-anchor="end" font-size="9" fill="currentColor" opacity="0.5">Mon</text>
    <text x="24" y="88" text-anchor="end" font-size="9" fill="currentColor" opacity="0.5">Wed</text>
    <text x="24" y="108" text-anchor="end" font-size="9" fill="currentColor" opacity="0.5">Fri</text>
    <rect x="30" y="60" width="520" height="70" fill="url(#heatmap-grid)"/>
    <g fill="#5e2fe0" opacity="0.3">
      <rect x="30" y="120" width="9" height="9" rx="4.5"/>
      <rect x="40" y="110" width="9" height="9" rx="4.5"/>
      <rect x="490" y="110" width="9" height="9" rx="4.5"/>
      <rect x="500" y="120" width="9" height="9" rx="4.5"/>
      <rect x="510" y="100" width="9" height="9" rx="4.5"/>
      <rect x="520" y="110" width="9" height="9" rx="4.5"/>
      <rect x="540" y="110" width="9" height="9" rx="4.5"/>
    </g>
    <g fill="#5e2fe0" opacity="0.65">
      <rect x="30" y="110" width="9" height="9" rx="4.5"/>
      <rect x="500" y="110" width="9" height="9" rx="4.5"/>
    </g>
    <g fill="#5e2fe0">
      <rect x="510" y="110" width="9" height="9" rx="4.5"/>
      <rect x="510" y="120" width="9" height="9" rx="4.5"/>
    </g>
    <text x="380" y="158" font-size="10" fill="currentColor" opacity="0.5">Less</text>
    <rect x="410" y="150" width="9" height="9" rx="4.5" fill="currentColor" opacity="0.1"/>
    <rect x="423" y="150" width="9" height="9" rx="4.5" fill="#5e2fe0" opacity="0.3"/>
    <rect x="436" y="150" width="9" height="9" rx="4.5" fill="#5e2fe0" opacity="0.65"/>
    <rect x="449" y="150" width="9" height="9" rx="4.5" fill="#5e2fe0"/>
    <text x="468" y="158" font-size="10" fill="currentColor" opacity="0.5">More</text>
    <text x="280" y="190" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.35">Illustrative OpenBin activity log — Christmas-lights bin</text>
  </svg>
</figure>

The "View inactive bins" link below each location heatmap is the cold-tier filter. Click it and you get a list of bins not scanned since whatever cutoff date you pick. That's Scott's two-year rule, parameterized.

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

**Export.** OpenBin can dump the activity log to CSV or JSON if you want to do your own analysis. Stickers don't export.

**Audit trail.** When something walks off, the scan history shows who touched the bin and when. Not relevant for most homes, very relevant for shared workshops, makerspaces, or households with kids and contractors coming through.

None of this is to say the digital approach is universally better. It says the two systems trade different things.

## What should "use" actually count as?

This is the question one HN commenter framed well: a bin you don't open isn't necessarily a bin you don't need. The ice cream maker on the shelf is the example. Scott handles this by exempting "obviously essential tools" from the dotting protocol — focus on ambiguous cases.

OpenBin handles it by letting you choose which actions count. There are four togglable signals in preferences:

- **Scan** (on by default) — physical scan of the QR code
- **Manual lookup** (on by default) — searching for the bin by name in the app
- **View** (off by default) — opening the bin's page for any reason
- **Modify** (off by default) — adding, removing, or editing items

The defaults match Scott's intent: count events that mean "I touched the physical thing," ignore events that just mean "I clicked around in the UI." Flip the switches if you want any interaction to count, or leave it on the default if you only want scans.

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
4. Open Settings → Preferences and confirm which signals count toward usage. Default is scan plus manual lookup.
5. Scan each bin when you open it. The heatmap fills in over the next few weeks.
6. Use **View inactive bins** under the location activity widget to find your cold tier.

The activity widget shows up in two places: each individual bin's detail page (per-bin heatmap) and the dashboard at the location level (aggregate across all bins). Both let you switch between daily, weekly, and monthly granularity, and both have a year pager.

## Frequently asked questions

### Does scanning a bin to add an item count as use?

Yes, by default. The scan event is recorded regardless of why you scanned. Subsequent edits don't get logged as separate usage events unless you explicitly enable that in preferences.

### Can I see usage at the item level instead of the bin level?

Not yet. The dot system measures box-opens, not item-uses, and OpenBin matches that. Per-item tracking would require tagging individual items as you remove them, which crosses the line from low-friction signal collection into full inventory management.

### Can I export the activity data?

Yes. The full activity log exports to CSV or JSON from the data settings page. The heatmap is just a render of the underlying log.

### Does it work offline?

Scanning works offline if you've installed OpenBin as a PWA — events queue locally and sync when you're back on a network. The heatmap render needs a fresh fetch.

### Doesn't this need everyone in the house to actually scan?

Yes, and so does Scott's system need everyone to apply stickers. The advantage of the scan is that anyone looking for an item is already opening the app to search — the scan happens at the same gesture, not as a separate discipline. The dot requires a separate, deliberate action after you've already gotten what you came for.

## Dots and heatmaps are measuring the same thing

Scott's article is doing real work. Storable and SpareFoot's 2025 Real Cost of Clutter report found 54% of Americans sacrifice 100–500 square feet of their home to possessions they rarely use, and 21% give up more than 500 square feet — roughly $113,500 in real-estate value at median home prices. Cold-tier bins add up, and the first step in getting any of that square footage back is being able to identify them. The system is small enough to maintain, visual enough to read at a glance, and structured enough to drive decisions about what to keep. The HN argument over whether dots are silly or brilliant is missing that the dots are an interface, and the interesting thing is the data behind the interface.

If you have a workshop and you want the analog thing, do the analog thing. If you have a household with shared bins, year-over-year history, and a need to actually find what's in each box, the same data wants a different interface.

[Sign up at openbin.app](https://openbin.app) — free tier covers 10 bins, the self-hosted version has no limits.

---

**Sources:** [A dot a day keeps the clutter away — Scott Lawson](https://scottlawsonbc.com/post/dot-system) · [Hacker News discussion](https://news.ycombinator.com/item?id=47593556) · [GitHub Docs — Contributions on your profile](https://docs.github.com/en/account-and-profile/concepts/contributions-on-your-profile) · [Storable & SpareFoot — The Real Cost of Clutter, 2025](https://www.prnewswire.com/news-releases/storable-and-sparefoot-release-the-real-cost-of-clutter-report-reveals-americans-pay-up-to-113-500-in-hidden-clutter-tax-on-their-homes-302428168.html)
