# Usage Tracking

OpenBin records when you interact with bins and displays the data as a heatmap — similar to a GitHub contribution graph. Use it to spot which bins you actually access and which ones sit untouched.

## Where it appears

- **Bin detail page** — the Information tab has a Usage section showing that bin's activity heatmap.
- **Dashboard** — the Activity widget shows a location-wide heatmap aggregating all bins.

<!-- TODO: screenshot of bin usage heatmap -->

## What gets tracked

By default, nothing is tracked. You choose which actions count from **Settings → Preferences → Usage Tracking**:

| Toggle | What it records |
|---|---|
| Scan QR code | Opening a bin by scanning its QR label |
| Manual code lookup | Looking up a bin by typing its short code |
| View bin | Opening a bin's detail page |
| Modify bin | Editing a bin's contents or metadata |

Each toggle is independent. Turn on the ones relevant to how you use OpenBin.

::: tip
Usage tracking is per-user. Your settings do not affect what other members see or record.
:::

## Reading the heatmap

Each cell represents a time period. Darker cells mean more activity. Hover over any cell to see the exact count and date.

The heatmap has three granularity levels, toggled with the segmented control above the chart:

| Granularity | What each cell represents |
|---|---|
| Daily | One cell per day, arranged in a week-by-week grid (7 rows × 53 columns) |
| Weekly | One cell per week in a single row |
| Monthly | One cell per month, 12 across |

Set the default granularity in **Settings → Preferences**.

## Year navigation

Use the year chips above the heatmap to switch between years. Only years with recorded activity are shown.

A summary line below the heatmap shows the number of active days in the selected year and when the bin was last used.

## Location activity widget

The Dashboard's activity widget works the same way but aggregates across all bins in the location. Each cell's intensity reflects how many distinct bins were accessed that day, not total event count.

The widget can be shown or hidden from the Dashboard settings.
