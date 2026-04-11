export const homeFaqs = [
  { q: 'Do I need AI to use OpenBin?', a: 'No. AI is optional. It speeds up cataloging but everything works without it. Bring your own API key from OpenAI, Anthropic, or Gemini if you want it.' },
  { q: 'Is my data private?', a: 'Yes. Self-host on your own hardware and your data never leaves your network. The cloud version stores data on managed infrastructure. No telemetry, no analytics, no third-party sharing.' },
  { q: 'What if OpenBin shuts down?', a: "It's open source. Your self-hosted instance keeps running. Cloud users can export everything (bins, items, photos, tags) in one click." },
  { q: 'Can I use it with my team?', a: 'Yes. Create a location, share an invite code. Three roles (admin, member, viewer) control who can edit and who can only browse.' },
  { q: 'What do I need to self-host?', a: 'One Docker container and a few hundred megabytes of disk space. Works on a Raspberry Pi.' },
  { q: 'Can I connect AI tools like Claude or ChatGPT?', a: 'Yes. Self-hosted OpenBin includes an MCP server that lets AI assistants read and manage your inventory directly. Generate an API key and point your AI tool at it.' },
]

export const cloudFaqs = [
  { q: "What's included in the free trial?", a: "Full Plus access for 7 days — up to 500 bins, photo uploads, custom fields, and export. No credit card required. After the trial you land on the Free plan — your data stays, you just can't grow past the Free limits until you upgrade." },
  { q: 'Can I switch plans later?', a: 'Yes. Upgrade or downgrade anytime from your account settings. Changes take effect immediately and billing is prorated.' },
  { q: 'How does self-hosted differ from cloud?', a: 'Same software, same features. Self-hosted runs on your hardware with your own AI API keys. Cloud runs on ours with managed AI, backups, and updates included.' },
  { q: 'What counts toward photo storage?', a: "Every photo you upload to a bin. Thumbnails are generated automatically and don't count against your limit. Self-hosted storage is limited by your disk space." },
  { q: 'Can I cancel anytime?', a: "Yes. No contracts, no cancellation fees. If you cancel a paid plan you drop to the Free tier — your data stays and you can keep using OpenBin within Free limits." },
  { q: 'Can I migrate from self-hosted to cloud?', a: 'Yes. Export your data from your self-hosted instance and import it into your cloud account. The process takes a few minutes.' },
]
