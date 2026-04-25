# Print Labels

![Print labels](/screenshots/print-labels.webp)

## Print Modes

OpenBin supports three print modes: **Labels**, **Names**, and **Item List** — toggle between them at the top of the print page.

### Labels

QR-coded sheets sized to standard label paper (Avery 5160 and friends). The default for scanning bins back to their detail page.

![Labels mode preview](/screenshots/print-labels-preview.webp)

### Names

Color-coded name cards with icons. Useful for shelf labels, drawer fronts, or anywhere you want a visible tag rather than a scannable code.

![Names mode](/screenshots/print-names.webp)

### Item List

Text-based inventory checklists with quantities, optional QR header, and write-in notes columns. Built for audits, packing lists, and offline inventory checks.

![Item List mode](/screenshots/print-item-list.webp)

## Selecting Bins

The left panel shows bins grouped by area with checkboxes. Select individual bins, all bins, or all bins within an area. The preview updates live.

## Label Modes

A label's rendered mode is chosen automatically from the Label Options toggles (QR Code, Bin Name, Bin Icon, Bin Code, Color Background). The three resulting modes are:

| Mode | When | Description |
|---|---|---|
| `plain-qr` | QR Code is shown (default) | QR code with bin name and short code. Color Background can be turned on to fill the label with the bin's color, or kept off for a black-and-white label suitable for thermal printers. |
| `icon-only` | QR Code is off and Bin Icon is on | Large icon centered on the label, with optional name and code. Useful when scanning isn't needed. |
| `text-only` | QR Code is off and Bin Icon is off | Bin name (and optional code) only. Useful for shelf or drawer labels. |

### Label Options

| Toggle | Effect |
|---|---|
| QR Code | Show or hide the QR. Off → label switches to `icon-only` or `text-only`. |
| Bin Name | Show or hide the bin name on the label. |
| Bin Icon | Show or hide the bin's icon. |
| Bin Code | Show or hide the 6-character short code as text. |
| Color Background | Fill the label with the bin's color (instead of white). |
| Label Direction | `auto`, `horizontal`, or `vertical` — controls QR/text layout. `auto` picks the better fit for the chosen format. |
| Copies per label | Print 1–10 duplicates of each selected bin in one run. |

## Item List Mode

In addition to label sheets, you can print a text-based item list:

1. Switch the **Print Mode** toggle from **Labels** to **Item List**.
2. Select the bins to include.
3. Configure options: whether to show areas, tags, quantities, and how items are grouped.
4. Click **Print** or **Download PDF**.

Item list mode is useful for inventory checklists, packing lists, or auditing what's in each bin without QR codes.

## Name Cards Mode

Name cards print a grid of bin names without QR codes. They work well for shelf labels, drawer fronts, or anywhere you need a visible name tag rather than a scannable code.

1. Switch the **Print Mode** toggle to **Names**.
2. Select the bins to include.
3. Configure the options described below.
4. Click **Print** or **Download PDF**.

The **Name Options** card controls what each card displays:

| Option | Description |
|---|---|
| Bin Icon | Show or hide the bin's icon next to its name. |
| Color Background | Fill each card with the bin's assigned color. When off, cards use a neutral background. |
| Font Sizing | **Auto-fit** scales each bin's text independently to fill its card. **Uniform** uses the same font size across all cards. |
| Font Size | Visible when sizing is set to Uniform. Choose from S, Default, L, or XL. |

Name cards share the same label format and page layout settings as the Labels mode, so you can use any of the built-in or custom label sizes.

## Orientation

Switch between **Portrait** and **Landscape** for any page format.

## Custom Label Size

For fine-grained control, switch to custom label sizing and specify:

- Label width and height
- Padding inside each label
- Labels per row

The display unit (inches or mm) is configurable in the Format card.

## Font Scale

Adjust the text size relative to the label size. Smaller labels may need a lower font scale to avoid overflow; larger labels benefit from a higher scale.

## QR Style Customization

The **QR Style** card lets you change the visual appearance of QR codes:

| Option | Choices |
|---|---|
| Dot style | square, rounded, dots, classy, classy-rounded, extra-rounded |
| Corner style | square, extra-rounded, dot |
| QR foreground color | Any color (hex or picker) |
| QR background color | Any color (hex or picker), or transparent |

::: warning
Highly stylized QR codes or very low-contrast colors may reduce scan reliability. Test scan your labels before printing a large batch.
:::

## Saving Presets

Once you have a format you're happy with, save it as a named preset:

1. In the Format card, enter a preset name.
2. Click **Save Preset**.

Saved presets appear in the format selector for quick reuse across sessions. Print settings (saved presets, the active format, label options, QR style, and selected print mode) are persisted server-side per user and sync across devices and browsers.

::: tip
For best results with browser print, set margins to "None" in the print dialog and match the paper size to your selected format.
:::
