# Attachments

Bins can hold file attachments alongside photos. Use attachments for manuals, receipts, spreadsheets, or any document you want to keep with a bin's contents.

::: info
Attachments are an optional feature. The server must have the `ATTACHMENTS_ENABLED=true` environment variable set. See [Configuration](/docs/getting-started/configuration) for other environment variables.
:::

## Supported file types

| Category | Formats |
|---|---|
| Documents | PDF, TXT, RTF, Markdown, JSON |
| Office | Word (.doc, .docx), Excel (.xls, .xlsx), PowerPoint (.ppt, .pptx) |
| OpenDocument | ODT, ODS, ODP |
| Archives | ZIP, 7z, tar, gz |

Maximum file size is 5 MB per file. Image files (JPEG, PNG, WebP) are handled separately through the [Photos](/docs/guide/photos) feature.

## Uploading files

Open a bin → scroll to the **Attachments** section → click **Add File**. You can select multiple files at once. Each file uploads independently — if one fails, the others still go through.

<!-- TODO: screenshot of attachments section with Add File button -->

Unsupported file types are rejected with an error message listing the allowed formats.

## Viewing and downloading

Attachments appear as cards showing the file extension, name, size, and upload time. Click any attachment card to download it.

## Deleting attachments

Hover over an attachment to reveal the delete button. Members can delete their own attachments. Admins can delete any attachment.

::: warning
Attachment deletion is permanent. There is no trash or recovery for deleted files.
:::
