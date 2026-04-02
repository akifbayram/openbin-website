<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// ── Rotating text ticker ──
const rotatingWords = ['garage', 'workshop', 'closet', 'storage', 'pantry']
const wordIndex = ref(0)
let tickerTimer = null
let scrollObserver = null

// ── FAQ accordion ──
const openFaq = ref(null)
function toggleFaq(i) {
  openFaq.value = openFaq.value === i ? null : i
}

const faqs = [
  { q: 'Do I need AI to use OpenBin?', a: 'No. AI is optional. It speeds up cataloging but everything works without it. Bring your own API key from OpenAI, Anthropic, or Gemini if you want it.' },
  { q: 'Is my data private?', a: 'Yes. Self-host on your own hardware and your data never leaves your network. The cloud version stores data on managed infrastructure. No telemetry, no analytics, no third-party sharing.' },
  { q: 'What if OpenBin shuts down?', a: "It's open source. Your self-hosted instance keeps running. Cloud users can export everything (bins, items, photos, tags) in one click." },
  { q: 'Can I use it with my team?', a: 'Yes. Create a location, share an invite code. Three roles (admin, member, viewer) control who can edit and who can only browse.' },
  { q: 'What do I need to self-host?', a: 'One Docker container and a few hundred megabytes of disk space. Works on a Raspberry Pi.' },
  { q: 'Can I connect AI tools like Claude or ChatGPT?', a: 'Yes. OpenBin includes an MCP server that lets AI assistants read and manage your inventory directly. Generate an API key and point your AI tool at it.' },
]

// ── AI Reorganization (Before/After Split) ──
const containerEl = ref(null)
const beforePanelEl = ref(null)
const afterPanelEl = ref(null)
const dividerLineEl = ref(null)
const dividerX = ref(55)
const activeScenario = ref(0)

const scenarios = [
  {
    label: 'Garage Cleanout',
    before: [
      { name: 'Stuff from garage', items: 'drill, tape, screws, batteries, rope', tilt: 'rotate(-3.5deg) translate(-6px, -2px)' },
      { name: 'Kitchen junk drawer', items: 'spatula, batteries, tape measure', tilt: 'rotate(2.5deg) translate(8px, 0)' },
      { name: 'Random drawer', items: 'scissors, screwdriver, string, super glue', tilt: 'rotate(-1.5deg) translate(-4px, 2px)' },
      { name: 'Under the sink', items: 'sponges, trash bags, detergent, rags', tilt: 'rotate(1.5deg) translate(4px, -1px)' },
      { name: 'Box #7', items: 'cables, adapters, zip ties, velcro', tilt: 'rotate(-2deg) translate(-2px, 1px)' },
      { name: 'Hallway closet', items: 'lightbulbs, gloves, flashlight, tape', tilt: 'rotate(2deg) translate(5px, 3px)' },
      { name: 'Workbench pile', items: 'sandpaper, clamps, wood glue, nails', tilt: 'rotate(-1deg) translate(-3px, -1px)' },
      { name: 'Catch-all basket', items: 'pens, rubber bands, keys, charger', tilt: 'rotate(3deg) translate(2px, 2px)' },
    ],
    after: [
      { name: 'Power Tools', area: 'Garage', items: 'drill, screwdriver, clamps', bg: 'linear-gradient(135deg, color-mix(in oklch, #3b82f6 50%, #1a1a2e), color-mix(in oklch, #2563eb 30%, #1a1a2e))', tag: 'workshop', tagBg: 'rgba(59,130,246,0.3)', tagColor: '#93c5fd', icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z' },
      { name: 'Hardware', area: 'Garage', items: 'screws, nails, tape, rope, zip ties, velcro', bg: 'linear-gradient(135deg, color-mix(in oklch, #f59e0b 45%, #1a1a2e), color-mix(in oklch, #d97706 28%, #1a1a2e))', tag: 'supplies', tagBg: 'rgba(245,158,11,0.3)', tagColor: '#fcd34d', icon: 'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z' },
      { name: 'Kitchen & Cleaning', area: 'Kitchen', items: 'spatula, sponges, detergent, rags, trash bags', bg: 'linear-gradient(135deg, color-mix(in oklch, #22c55e 45%, #1a1a2e), color-mix(in oklch, #16a34a 28%, #1a1a2e))', tag: 'kitchen', tagBg: 'rgba(34,197,94,0.3)', tagColor: '#86efac', icon: 'M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z' },
      { name: 'Electrical', area: 'Garage', items: 'batteries, lightbulbs, cables, adapters, charger', bg: 'linear-gradient(135deg, color-mix(in oklch, #a855f7 45%, #1a1a2e), color-mix(in oklch, #7c3aed 28%, #1a1a2e))', tag: 'electrical', tagBg: 'rgba(168,85,247,0.3)', tagColor: '#c4b5fd', icon: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z' },
      { name: 'Office & Misc', area: 'Office', items: 'pens, rubber bands, scissors, tape measure, keys', bg: 'linear-gradient(135deg, color-mix(in oklch, #14b8a6 45%, #1a1a2e), color-mix(in oklch, #0d9488 28%, #1a1a2e))', tag: 'office', tagBg: 'rgba(20,184,166,0.3)', tagColor: '#5eead4', icon: 'M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z' },
      { name: 'Finishing', area: 'Garage', items: 'sandpaper, wood glue, flashlight, gloves', bg: 'linear-gradient(135deg, color-mix(in oklch, #ec4899 45%, #1a1a2e), color-mix(in oklch, #db2777 28%, #1a1a2e))', tag: 'finishing', tagBg: 'rgba(236,72,153,0.3)', tagColor: '#f9a8d4', icon: 'm9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08' },
    ],
  },
  {
    label: 'Moving Day',
    before: [
      { name: 'Living Room Box 1', items: 'books, remote, coasters, candles', tilt: 'rotate(-2deg) translate(-4px, -3px)' },
      { name: 'Living Room Box 2', items: 'phone charger, magazines, throw pillow', tilt: 'rotate(1.5deg) translate(6px, 1px)' },
      { name: 'Bedroom Stuff', items: 'alarm clock, lamp, extension cord, novels', tilt: 'rotate(3deg) translate(4px, 0)' },
      { name: 'Closet Cleanout', items: 'hangers, shoe polish, lint roller, sewing kit', tilt: 'rotate(-1deg) translate(-2px, 4px)' },
      { name: 'Junk Drawer', items: 'batteries, tape, scissors, pens, rubber bands', tilt: 'rotate(2deg) translate(3px, -2px)' },
      { name: 'Bathroom Box', items: 'towels, first aid kit, medicine', tilt: 'rotate(-2.5deg) translate(-5px, 0)' },
      { name: 'Kitchen Box 1', items: 'spatula, whisk, measuring cups, timer', tilt: 'rotate(1deg) translate(2px, 3px)' },
      { name: 'Garage misc', items: 'flashlight, duct tape, bungee cords, gloves', tilt: 'rotate(-3deg) translate(-4px, -1px)' },
    ],
    after: [
      { name: 'Books & Media', area: 'Living Room', items: 'books, novels, magazines, remote, coasters', bg: 'linear-gradient(135deg, color-mix(in oklch, #6366f1 50%, #1a1a2e), color-mix(in oklch, #4f46e5 30%, #1a1a2e))', tag: 'media', tagBg: 'rgba(99,102,241,0.3)', tagColor: '#a5b4fc', icon: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20' },
      { name: 'Lighting & Power', area: 'Bedroom', items: 'lamp, extension cord, charger, batteries, flashlight', bg: 'linear-gradient(135deg, color-mix(in oklch, #f59e0b 45%, #1a1a2e), color-mix(in oklch, #d97706 28%, #1a1a2e))', tag: 'electrical', tagBg: 'rgba(245,158,11,0.3)', tagColor: '#fcd34d', icon: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z' },
      { name: 'First Aid & Bath', area: 'Bathroom', items: 'first aid kit, medicine, towels', bg: 'linear-gradient(135deg, color-mix(in oklch, #ef4444 45%, #1a1a2e), color-mix(in oklch, #dc2626 28%, #1a1a2e))', tag: 'health', tagBg: 'rgba(239,68,68,0.3)', tagColor: '#fca5a5', icon: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' },
      { name: 'Kitchen', area: 'Kitchen', items: 'spatula, whisk, measuring cups, timer', bg: 'linear-gradient(135deg, color-mix(in oklch, #22c55e 45%, #1a1a2e), color-mix(in oklch, #16a34a 28%, #1a1a2e))', tag: 'kitchen', tagBg: 'rgba(34,197,94,0.3)', tagColor: '#86efac', icon: 'M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z' },
      { name: 'Office & Craft', area: 'Office', items: 'pens, tape, scissors, rubber bands, sewing kit', bg: 'linear-gradient(135deg, color-mix(in oklch, #14b8a6 45%, #1a1a2e), color-mix(in oklch, #0d9488 28%, #1a1a2e))', tag: 'office', tagBg: 'rgba(20,184,166,0.3)', tagColor: '#5eead4', icon: 'M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z' },
      { name: 'Clothing Care', area: 'Closet', items: 'hangers, shoe polish, lint roller', bg: 'linear-gradient(135deg, color-mix(in oklch, #a855f7 45%, #1a1a2e), color-mix(in oklch, #7c3aed 28%, #1a1a2e))', tag: 'clothing', tagBg: 'rgba(168,85,247,0.3)', tagColor: '#c4b5fd', icon: 'M20.38 3.46 16 2 12 5.5 8 2 3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z' },
    ],
  },
  {
    label: 'Workshop',
    before: [
      { name: 'Bin A — Finishing', items: 'sandpaper, wood glue, paint brushes, stain', tilt: 'rotate(-2.5deg) translate(-5px, -1px)' },
      { name: 'Bin B — Mixed', items: 'drill bits, screws, nails, wall anchors', tilt: 'rotate(2deg) translate(6px, 2px)' },
      { name: 'Old toolbox', items: 'pliers, wrench set, hex keys, wire cutters', tilt: 'rotate(-1deg) translate(-3px, 3px)' },
      { name: 'Shelf stuff', items: 'safety glasses, ear plugs, dust masks', tilt: 'rotate(1.5deg) translate(4px, 0)' },
      { name: 'Misc hardware', items: 'hinges, drawer slides, cabinet knobs', tilt: 'rotate(-3deg) translate(-2px, -2px)' },
      { name: 'Peg board overflow', items: 'clamps, tape measure, level, chalk line', tilt: 'rotate(2.5deg) translate(3px, 1px)' },
      { name: 'Under the bench', items: 'bolts, cup hooks, work gloves, rags', tilt: 'rotate(-1.5deg) translate(-5px, 2px)' },
      { name: 'Tin can of bits', items: 'drill bits, router bits, jigsaw blades', tilt: 'rotate(1deg) translate(2px, -3px)' },
    ],
    after: [
      { name: 'Fasteners', area: 'Workshop', items: 'screws, nails, bolts, wall anchors, cup hooks', bg: 'linear-gradient(135deg, color-mix(in oklch, #f59e0b 45%, #1a1a2e), color-mix(in oklch, #d97706 28%, #1a1a2e))', tag: 'hardware', tagBg: 'rgba(245,158,11,0.3)', tagColor: '#fcd34d', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z' },
      { name: 'Hand Tools', area: 'Workshop', items: 'pliers, wrench set, hex keys, wire cutters, clamps', bg: 'linear-gradient(135deg, color-mix(in oklch, #3b82f6 50%, #1a1a2e), color-mix(in oklch, #2563eb 30%, #1a1a2e))', tag: 'tools', tagBg: 'rgba(59,130,246,0.3)', tagColor: '#93c5fd', icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z' },
      { name: 'Finishing', area: 'Workshop', items: 'sandpaper, wood glue, paint brushes, stain', bg: 'linear-gradient(135deg, color-mix(in oklch, #22c55e 45%, #1a1a2e), color-mix(in oklch, #16a34a 28%, #1a1a2e))', tag: 'finishing', tagBg: 'rgba(34,197,94,0.3)', tagColor: '#86efac', icon: 'm9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08' },
      { name: 'Power Bits', area: 'Workshop', items: 'drill bits, router bits, jigsaw blades', bg: 'linear-gradient(135deg, color-mix(in oklch, #ec4899 45%, #1a1a2e), color-mix(in oklch, #db2777 28%, #1a1a2e))', tag: 'bits', tagBg: 'rgba(236,72,153,0.3)', tagColor: '#f9a8d4', icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
      { name: 'Safety Gear', area: 'Workshop', items: 'safety glasses, ear plugs, dust masks, gloves', bg: 'linear-gradient(135deg, color-mix(in oklch, #ef4444 45%, #1a1a2e), color-mix(in oklch, #dc2626 28%, #1a1a2e))', tag: 'safety', tagBg: 'rgba(239,68,68,0.3)', tagColor: '#fca5a5', icon: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z' },
      { name: 'Measuring', area: 'Workshop', items: 'tape measure, level, chalk line', bg: 'linear-gradient(135deg, color-mix(in oklch, #a855f7 45%, #1a1a2e), color-mix(in oklch, #7c3aed 28%, #1a1a2e))', tag: 'measuring', tagBg: 'rgba(168,85,247,0.3)', tagColor: '#c4b5fd', icon: 'M2 6h4M2 12h4M2 18h4M21 6H10M21 12H10M21 18H10' },
    ],
  },
]

const currentScenario = computed(() => scenarios[activeScenario.value])
const beforeCalloutOpacity = computed(() => Math.max(0, Math.min(1, (dividerX.value - 60) / 18)))
const afterCalloutOpacity = computed(() => Math.max(0, Math.min(1, (40 - dividerX.value) / 18)))
const itemCount = computed(() => {
  let count = 0
  for (const bin of currentScenario.value.before) count += bin.items.split(',').length
  return count
})

const SPRING = 6
let targetX = 55, currentX = 55, lastFrame = 0, animId = null, userHovering = false, sweepPhase = 0, splitVisible = false

function applySplit(pos) {
  const x = Math.max(0, Math.min(100, pos))
  dividerX.value = x
  if (beforePanelEl.value) beforePanelEl.value.style.clipPath = `inset(0 ${100 - x}% 0 0)`
  if (afterPanelEl.value) afterPanelEl.value.style.clipPath = `inset(0 0 0 ${x}%)`
  if (dividerLineEl.value) {
    dividerLineEl.value.setAttribute('x1', x)
    dividerLineEl.value.setAttribute('x2', x)
  }
}

function tick(now) {
  if (!splitVisible) { animId = null; return }
  const dt = Math.min(0.05, (now - lastFrame) / 1000)
  lastFrame = now
  if (!userHovering) { sweepPhase += dt * 0.35; targetX = 52 + 26 * Math.sin(sweepPhase) }
  currentX += (targetX - currentX) * (1 - Math.exp(-SPRING * dt))
  applySplit(currentX)
  animId = requestAnimationFrame(tick)
}

function onPointerMove(e) {
  if (!containerEl.value) return
  userHovering = true
  const rect = containerEl.value.getBoundingClientRect()
  targetX = ((e.clientX - rect.left) / rect.width) * 100 < 50 ? 80 : 25
}

function onPointerLeave() { userHovering = false }

// ── Ask AI Terminal ──
const termEl = ref(null)
const phase = ref(0)
const currentSimIndex = ref(0)
const typedText = ref('')
const visibleLines = ref(0)
const transitioning = ref(false)
let termTimers = []
let termStarted = false

const sims = [
  {
    command: 'Where is the glass cleaner?',
    thinking: 'Searching 12 bins, 48 items\u2026',
    streaming: (n) => `Found in ${n} bin${n !== 1 ? 's' : ''}:`,
    results: [
      { label: 'Kitchen Cabinet', detail: 'glass cleaner (spray)' },
      { label: 'Cleaning Supplies', detail: 'glass cleaner (refill), sponges' },
    ],
    done: 'Found in 2 bins',
  },
  {
    command: 'Add drill bits and sandpaper to Workshop',
    thinking: 'Updating Workshop\u2026',
    streaming: (n) => `${n} item${n !== 1 ? 's' : ''} added:`,
    results: [
      { label: '+ drill bits (12-pack)', detail: '\u2192 Workshop' },
      { label: '+ sandpaper (assorted)', detail: '\u2192 Workshop' },
    ],
    done: '2 items added to Workshop',
  },
  {
    command: 'Move batteries from kitchen to garage',
    thinking: 'Scanning Kitchen Box\u2026',
    streaming: (n) => `Moving ${n} item${n !== 1 ? 's' : ''}:`,
    results: [
      { label: '4\u00d7 AA batteries', detail: '\u2192 Garage Shelf' },
      { label: '2\u00d7 AAA batteries', detail: '\u2192 Garage Shelf' },
      { label: '1\u00d7 9V battery', detail: '\u2192 Garage Shelf' },
    ],
    done: '7 batteries moved to Garage Shelf',
  },
  {
    command: 'Create a camping gear bin with tent, flashlight, rope',
    thinking: 'Creating bin in Garage\u2026',
    streaming: () => 'Camping Gear created:',
    results: [
      { label: 'Camping Gear', detail: 'new bin \u2192 Garage' },
      { label: '+ tent', detail: '' },
      { label: '+ flashlight', detail: '' },
      { label: '+ rope', detail: '' },
    ],
    done: 'Bin created with 3 items',
  },
  {
    command: 'Tag all garage bins as hardware',
    thinking: 'Scanning Garage area\u2026',
    streaming: (n) => `${n} bin${n !== 1 ? 's' : ''} tagged:`,
    results: [
      { label: 'Power Tools', detail: '+hardware' },
      { label: 'Fasteners Box', detail: '+hardware' },
      { label: 'Paint Supplies', detail: '+hardware' },
      { label: 'Electrical', detail: '+hardware' },
    ],
    done: '4 bins tagged',
  },
]

const sim = computed(() => sims[currentSimIndex.value])

function clearTermTimers() {
  termTimers.forEach(t => { clearTimeout(t); clearInterval(t) })
  termTimers = []
}

function pushTimer(fn, ms) {
  const id = setTimeout(fn, ms)
  termTimers.push(id)
  return id
}

function runSim() {
  clearTermTimers()
  phase.value = 1
  typedText.value = ''
  visibleLines.value = 0
  let i = 0
  const cmd = sim.value.command
  const typeInterval = setInterval(() => {
    if (i < cmd.length) { typedText.value = cmd.slice(0, i + 1); i++ }
    else {
      clearInterval(typeInterval)
      pushTimer(() => {
        phase.value = 2
        pushTimer(() => {
          phase.value = 3
          let line = 0
          const lineInterval = setInterval(() => {
            if (line < sim.value.results.length) { visibleLines.value = line + 1; line++ }
            else {
              clearInterval(lineInterval)
              pushTimer(() => {
                phase.value = 4
                pushTimer(() => {
                  transitioning.value = true
                  pushTimer(() => {
                    currentSimIndex.value = (currentSimIndex.value + 1) % sims.length
                    phase.value = 0; typedText.value = ''; visibleLines.value = 0
                    transitioning.value = false
                    pushTimer(runSim, 600)
                  }, 400)
                }, 2500)
              }, 400)
            }
          }, 300)
          termTimers.push(lineInterval)
        }, 1200)
      }, 300)
    }
  }, 45)
  termTimers.push(typeInterval)
}

// ── Photo to Bin Timeline ──
const ptbStage = ref(0)
let ptbTimers = []
let ptbAnimId = null
const ptbCounter = ref(0)
const ptbCurrentBin = ref(0)
const ptbBinItems = ref(0)
const ptbBinTransition = ref('')

const ptbBins = [
  {
    name: 'Workshop Drawer',
    photo: '#4a3f6b',
    items: [
      { n: 'Drill bits', q: '\u00d72' },
      { n: 'Sandpaper', q: '\u00d71' },
      { n: 'Wood glue', q: '\u00d71' },
      { n: 'Paint brushes', q: '\u00d72' },
    ],
  },
  {
    name: 'Fasteners Box',
    photo: '#3b5998',
    items: [
      { n: 'Screws, assorted', q: '\u00d72' },
      { n: 'Wall anchors', q: '\u00d71' },
      { n: 'Nails', q: '\u00d72' },
      { n: 'Cable ties', q: '\u00d71' },
    ],
  },
  {
    name: 'Paint Supplies',
    photo: '#6b4c3b',
    items: [
      { n: 'Spray paint cans', q: '\u00d72' },
      { n: 'Painter\u2019s tape', q: '\u00d71' },
      { n: 'Drop cloth', q: '\u00d71' },
      { n: 'Rollers', q: '\u00d72' },
    ],
  },
]

function ptbStreamBin(binIndex) {
  ptbBinItems.value = 0
  ptbBinTransition.value = 'ptb-slide-in'
  ptbCurrentBin.value = binIndex

  ptbTimers.push(setTimeout(() => { ptbBinTransition.value = '' }, 350))

  const items = ptbBins[binIndex].items
  for (let i = 1; i <= items.length; i++) {
    ptbTimers.push(setTimeout(() => { ptbBinItems.value = i }, 350 + i * 200))
  }

  const streamDone = 350 + items.length * 200 + 600

  if (binIndex < ptbBins.length - 1) {
    ptbTimers.push(setTimeout(() => { ptbBinTransition.value = 'ptb-slide-out' }, streamDone))
    ptbTimers.push(setTimeout(() => { ptbStreamBin(binIndex + 1) }, streamDone + 400))
  } else {
    ptbTimers.push(setTimeout(() => {
      ptbStage.value = 4
      ptbAnimateCount(ptbCounter, 3, 800)
    }, streamDone + 200))
  }
}

function ptbAnimateCount(target, max, duration) {
  const start = performance.now()
  function ptbTick(now) {
    const p = Math.min((now - start) / duration, 1)
    target.value = Math.round((1 - Math.pow(1 - p, 3)) * max)
    if (p < 1) ptbAnimId = requestAnimationFrame(ptbTick)
    else ptbAnimId = null
  }
  ptbAnimId = requestAnimationFrame(ptbTick)
}

function startPhotoToBin() {
  if (ptbStage.value > 0) return
  ptbStage.value = 1
  ptbTimers.push(setTimeout(() => { ptbStage.value = 2 }, 1200))
  ptbTimers.push(setTimeout(() => {
    ptbStage.value = 3
    ptbStreamBin(0)
  }, 2200))
}

// ── FAQ structured data (JSON-LD) ──
function injectFaqSchema() {
  if (document.getElementById('home-faq-schema')) return
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = 'home-faq-schema'
  script.textContent = JSON.stringify(schema)
  document.head.appendChild(script)
}

// ── Lifecycle ──
onMounted(() => {
  tickerTimer = setInterval(() => {
    wordIndex.value = (wordIndex.value + 1) % rotatingWords.length
  }, 3000)

  injectFaqSchema()

  const revealTargets = document.querySelectorAll(
    '.scroll-reveal, .scroll-slide-left, .scroll-slide-right, .scroll-scale-in, .tilt-reveal'
  )
  if (revealTargets.length) {
    scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible')
            scrollObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    revealTargets.forEach((el) => scrollObserver.observe(el))
  }

  // Split divider animation — only runs when visible
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    applySplit(55)
  } else if (containerEl.value) {
    const splitObs = new IntersectionObserver(([entry]) => {
      splitVisible = entry.isIntersecting
      if (splitVisible && !animId) {
        lastFrame = performance.now()
        animId = requestAnimationFrame(tick)
      }
    }, { threshold: 0 })
    splitObs.observe(containerEl.value)
  }

  // Photo to Bin intersection observer
  const ptbTrigger = document.getElementById('ptb-trigger')
  if (ptbTrigger) {
    const ptbObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { startPhotoToBin(); ptbObs.disconnect() }
      },
      { threshold: 0.2 }
    )
    ptbObs.observe(ptbTrigger)
  }

  // Terminal intersection observer
  if (termEl.value) {
    const termObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !termStarted) {
          termStarted = true
          runSim()
          termObs.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    termObs.observe(termEl.value)
  }
})

onUnmounted(() => {
  if (tickerTimer) clearInterval(tickerTimer)
  if (scrollObserver) scrollObserver.disconnect()
  if (animId) cancelAnimationFrame(animId)
  clearTermTimers()
  ptbTimers.forEach(clearTimeout)
  if (ptbAnimId) cancelAnimationFrame(ptbAnimId)
  document.getElementById('home-faq-schema')?.remove()
})
</script>

<template>
  <div class="home-layout">
    <!-- ════════ Hero ════════ -->
    <section class="hero-bg px-6 pt-16 pb-12 text-center">
      <h1
        class="display-heading gradient-text animate-in mx-auto max-w-3xl text-4xl lg:text-6xl"
      >
        Inventory with intelligence.
      </h1>

      <p class="animate-in delay-1 mx-auto mt-6 max-w-2xl text-lg lg:text-xl">
        Organize your
        <span class="ticker-wrapper">
          <Transition name="ticker" mode="out-in">
            <span :key="wordIndex" class="ticker-word">{{ rotatingWords[wordIndex] }}</span>
          </Transition>
        </span>
      </p>

      <p class="animate-in delay-2 mx-auto mt-2 max-w-2xl text-base lg:text-lg">
        QR labels and AI-powered photo recognition.
      </p>

      <div class="animate-in delay-3 mt-8 flex flex-wrap justify-center gap-4">
        <a href="/docs/getting-started/" class="btn-primary">
          Get Started <span class="btn-arrow">&rarr;</span>
        </a>
        <a href="https://demo.openbin.app" target="_blank" rel="noopener" class="btn-secondary">
          Try Demo <span class="btn-arrow">&rarr;</span>
        </a>
        <a href="https://cloud.openbin.app/" class="btn-secondary">
          Try Cloud <span class="btn-arrow">&rarr;</span>
        </a>
      </div>
      <p class="animate-in delay-4 mt-4 text-center text-sm">
        7-day free trial &middot; No credit card required
      </p>

      <div class="animate-in delay-4 mt-6 flex flex-wrap items-center justify-center gap-5 text-sm" style="color: var(--vp-c-text-3)">
        <a
          href="https://github.com/akifbayram/openbin"
          target="_blank"
          rel="noopener"
          class="social-proof-link"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="shrink-0"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          Open source on GitHub
        </a>
        <span class="social-proof-dot" aria-hidden="true"></span>
        <span>Single Docker container</span>
        <span class="social-proof-dot" aria-hidden="true"></span>
        <span>Runs on a Raspberry Pi</span>
      </div>

      <!-- Live demo (desktop) / static screenshot (mobile) -->
      <div class="animate-in delay-5 mx-auto mt-12 max-w-5xl">
        <div class="relative hidden lg:block">
          <div class="device-frame">
            <div class="bezel-label">
              <span class="bezel-status-dot"></span>
              LIVE DEMO
            </div>
            <div class="device-frame-screen">
              <iframe
                src="https://demo.openbin.app"
                title="OpenBin Demo"
                loading="lazy"
                allow="clipboard-write"
                class="w-full"
                style="height: 600px; border: none; background: var(--vp-c-bg)"
              />
            </div>
          </div>
        </div>
        <div class="device-frame lg:hidden">
          <div class="device-frame-screen">
            <img
              src="/screenshots/dashboard.png"
              alt="OpenBin dashboard showing bins, items, and search"
              width="1280"
              height="900"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ Feature Marquee ════════ -->
    <section class="py-8 overflow-hidden" style="background: var(--vp-c-bg-soft)" aria-hidden="true">
      <div class="marquee-track mb-3">
        <div class="marquee-content marquee-scroll-left">
          <template v-for="n in 2" :key="'a' + n">
            <span class="marquee-badge"><span class="marquee-dot"></span>AI Photo Recognition</span>
            <span class="marquee-badge"><span class="marquee-dot"></span>100+ Label Formats</span>
            <span class="marquee-badge"><span class="marquee-dot"></span>Natural Language Commands</span>
            <span class="marquee-badge"><span class="marquee-dot"></span>Bulk Operations</span>
            <span class="marquee-badge"><span class="marquee-dot"></span>Custom QR Styles</span>
            <span class="marquee-badge"><span class="marquee-dot"></span>Activity Logging</span>
            <span class="marquee-badge"><span class="marquee-dot"></span>Photo Storage</span>
            <span class="marquee-badge"><span class="marquee-dot"></span>Data Export</span>
            <span class="marquee-badge"><span class="marquee-dot"></span>Saved Views</span>
          </template>
        </div>
      </div>
      <div class="marquee-track">
        <div class="marquee-content marquee-scroll-right">
          <template v-for="n in 2" :key="'b' + n">
            <span class="marquee-badge"><span class="marquee-dot"></span>Self-Hosted</span>
            <span class="marquee-badge"><span class="marquee-dot"></span>Open Source</span>
            <span class="marquee-badge"><span class="marquee-dot"></span>OpenAI, Claude &amp; Gemini</span>
            <span class="marquee-badge"><span class="marquee-dot"></span>Custom Fields</span>
            <span class="marquee-badge"><span class="marquee-dot"></span>Tag Colors</span>
            <span class="marquee-badge"><span class="marquee-dot"></span>Areas &amp; Hierarchy</span>
            <span class="marquee-badge"><span class="marquee-dot"></span>Trash Recovery</span>
            <span class="marquee-badge"><span class="marquee-dot"></span>API Access</span>
            <span class="marquee-badge"><span class="marquee-dot"></span>MCP Server</span>
          </template>
        </div>
      </div>
    </section>

    <!-- ════════ How It Works ════════ -->
    <section class="px-6 py-16">
      <div class="mx-auto max-w-5xl">
        <h2
          class="display-heading scroll-reveal mb-2 text-center text-3xl lg:text-4xl"
        >
          How It Works
        </h2>
        <p class="scroll-reveal mb-12 text-center text-lg">
          Set up in a few minutes.
        </p>
        <div class="steps-wire grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div class="scroll-reveal stagger-1 text-center relative z-10">
            <div class="step-number mx-auto mb-4">1</div>
            <h3 class="text-xl font-semibold">Snap a photo</h3>
            <p class="mx-auto mt-2 max-w-xs">
              Take a picture of what's inside. AI names the bin, lists every
              item, and suggests tags. Or type it yourself.
            </p>
          </div>
          <div class="scroll-reveal stagger-2 text-center relative z-10">
            <div class="step-number mx-auto mb-4">2</div>
            <h3 class="text-xl font-semibold">Stick a QR label</h3>
            <p class="mx-auto mt-2 max-w-xs">
              Print a label and stick it on the box, shelf, or drawer.
              Customize the format, colors, and style.
            </p>
          </div>
          <div class="scroll-reveal stagger-3 text-center relative z-10">
            <div class="step-number mx-auto mb-4">3</div>
            <h3 class="text-xl font-semibold">Scan to find anything</h3>
            <p class="mx-auto mt-2 max-w-xs">
              Scan any label with your phone to see what's inside. Or search
              by name, tag, or area.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ Photo to Bin ════════ -->
    <section class="px-6 py-16" style="background: var(--vp-c-bg-soft)">
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="display-heading scroll-reveal mb-2 text-3xl lg:text-4xl">
          Photo in. Inventory out.
        </h2>
        <p class="scroll-reveal mt-4 text-lg" style="color: var(--vp-c-text-2)">
          Three steps from messy drawer to organized bin. AI does the heavy lifting.
        </p>
      </div>

      <div id="ptb-trigger" class="ptb-trigger mx-auto">
        <div class="ptb-timeline">
          <!-- Step 1: Upload -->
          <div class="ptb-row" :class="{ 'ptb-active': ptbStage >= 1, 'ptb-done': ptbStage >= 2 }">
            <div class="ptb-rail">
              <div class="ptb-node"><span class="ptb-node-num">1</span><span class="ptb-node-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span></div>
              <div class="ptb-line" :class="{ 'ptb-line-filled': ptbStage >= 2 }"></div>
            </div>
            <div class="ptb-content">
              <div class="ptb-step-label">Upload</div>
              <div class="ptb-card">
                <div class="ptb-photo-grid">
                  <div class="ptb-photo-thumb" v-for="(c, i) in ptbBins" :key="i">
                    <div class="ptb-pm" :style="{ background: c.photo }"></div>
                  </div>
                  <div class="ptb-photo-thumb ptb-photo-add">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                </div>
                <div class="ptb-mode-toggle">
                  <span class="ptb-mode-pill ptb-mode-active">One bin per photo</span>
                  <span class="ptb-mode-pill">All in one bin</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Analyze (multi-bin carousel) -->
          <div class="ptb-row" :class="{ 'ptb-active': ptbStage >= 3, 'ptb-done': ptbStage >= 4 }">
            <div class="ptb-rail">
              <div class="ptb-node"><span class="ptb-node-num">2</span><span class="ptb-node-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span></div>
              <div class="ptb-line" :class="{ 'ptb-line-filled': ptbStage >= 4 }"></div>
            </div>
            <div class="ptb-content">
              <div class="ptb-step-label">
                Analyze
                <span v-if="ptbStage >= 3 && ptbStage < 4" class="ptb-step-counter">
                  Photo {{ ptbCurrentBin + 1 }} of {{ ptbBins.length }}
                </span>
              </div>
              <div class="ptb-card ptb-card-analyze">
                <div class="ptb-bin-slide" :class="ptbBinTransition">
                  <div class="ptb-analyze-row">
                    <div class="ptb-analyze-photo">
                      <div class="ptb-pm ptb-pm-lg" :style="{ background: ptbBins[ptbCurrentBin].photo }"></div>
                      <div class="ptb-shimmer" :class="{ 'ptb-shimmer-on': ptbStage >= 3 && ptbStage < 4 }"></div>
                    </div>
                    <div class="ptb-analyze-result">
                      <div class="ptb-bin-name">{{ ptbBins[ptbCurrentBin].name }}</div>
                      <div class="ptb-stream-items">
                        <div
                          v-for="(item, i) in ptbBins[ptbCurrentBin].items"
                          :key="ptbCurrentBin + '-' + item.n"
                          class="ptb-stream-item"
                          :class="{ 'ptb-stream-show': ptbBinItems > i }"
                        >
                          <span>{{ item.n }}</span>
                          <span class="ptb-item-qty">{{ item.q }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="ptb-analyze-status" v-if="ptbStage >= 3 && ptbStage < 4">
                  <svg class="ptb-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--vp-c-brand-3)" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  Analyzing photo {{ ptbCurrentBin + 1 }} of {{ ptbBins.length }}...
                </div>

                <div class="ptb-bin-dots" v-if="ptbStage >= 3">
                  <span
                    v-for="(_, i) in ptbBins"
                    :key="i"
                    class="ptb-bin-dot"
                    :class="{ 'ptb-dot-active': ptbCurrentBin === i, 'ptb-dot-done': ptbCurrentBin > i || ptbStage >= 4 }"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Create -->
          <div class="ptb-row" :class="{ 'ptb-active': ptbStage >= 4 }">
            <div class="ptb-rail">
              <div class="ptb-node"><span class="ptb-node-num">3</span><span class="ptb-node-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span></div>
            </div>
            <div class="ptb-content">
              <div class="ptb-step-label">Create</div>
              <div class="ptb-card">
                <div class="ptb-progress-bar">
                  <div class="ptb-progress-fill" :style="{ transform: ptbStage >= 4 ? 'scaleX(1)' : 'scaleX(0)' }"></div>
                </div>
                <div class="ptb-created-list">
                  <div class="ptb-created-item" v-for="(bin, i) in ptbBins" :key="bin.name" :class="{ 'ptb-created-show': ptbCounter > i }">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    <span>{{ bin.name }}</span>
                    <span class="ptb-created-meta">{{ bin.items.length }} items</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ AI Reorganization Split ════════ -->
    <section class="px-6 py-16">
      <div class="mx-auto max-w-5xl text-center">
        <h2 class="display-heading scroll-reveal mb-4 text-3xl lg:text-4xl">
          AI reorganization
        </h2>
        <p class="scroll-reveal mb-6 text-lg" style="color: var(--vp-c-text-2)">
          Select messy bins. Get a clean layout. One click to apply.
        </p>

        <!-- Scenario picker -->
        <div class="scroll-reveal scenario-picker mb-6" role="radiogroup" aria-label="Reorganization scenario">
          <button
            v-for="(s, i) in scenarios"
            :key="s.label"
            role="radio"
            :aria-checked="activeScenario === i"
            class="scenario-btn"
            :class="{ 'scenario-btn--active': activeScenario === i }"
            @click="activeScenario = i"
          >
            {{ s.label }}
          </button>
        </div>

        <!-- Desktop: Split comparison -->
        <div
          ref="containerEl"
          class="split-container scroll-reveal hidden md:block"
          @pointermove="onPointerMove"
          @pointerleave="onPointerLeave"
        >
          <!-- Left panel: Before -->
          <div ref="beforePanelEl" class="split-panel split-panel--before">
            <div class="split-half split-half--left">
              <div class="split-badge split-badge--before">Before</div>
              <div class="messy-stack">
                <div
                  v-for="bin in currentScenario.before"
                  :key="bin.name"
                  class="messy-card"
                  :style="{ transform: bin.tilt }"
                >
                  <div class="messy-card-name">{{ bin.name }}</div>
                  <div class="messy-card-items">{{ bin.items }}</div>
                </div>
              </div>
              <div class="split-count">{{ currentScenario.before.length }} bins &middot; scattered</div>
            </div>
            <div class="callout callout--before" :style="{ opacity: beforeCalloutOpacity }">
              <div class="callout-big">{{ itemCount }}</div>
              <div class="callout-label">items across</div>
              <div class="callout-big">{{ currentScenario.before.length }}</div>
              <div class="callout-label">bins</div>
              <div class="callout-detail">no tags &middot; no areas</div>
            </div>
          </div>

          <!-- Right panel: After -->
          <div ref="afterPanelEl" class="split-panel split-panel--after">
            <div class="callout callout--after" :style="{ opacity: afterCalloutOpacity }">
              <div class="callout-big" style="color: var(--vp-c-brand-3)">Sorted</div>
              <div class="callout-label">in seconds</div>
              <div class="callout-detail" style="color: var(--vp-c-brand-3); margin-top: 1rem">
                tagged &middot; categorized
              </div>
              <div class="callout-detail">review before applying</div>
            </div>
            <div class="split-half split-half--right">
              <div class="split-badge split-badge--after">After</div>
              <div class="clean-grid">
                <div
                  v-for="bin in currentScenario.after"
                  :key="bin.name"
                  class="bin-card"
                  :style="{ background: bin.bg }"
                >
                  <svg class="bin-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="bin.icon"/></svg>
                  <div class="bin-card-name">{{ bin.name }}</div>
                  <div class="bin-card-area">{{ bin.area }}</div>
                  <div class="bin-card-items">{{ bin.items }}</div>
                  <div class="bin-card-tags">
                    <span class="bin-tag" :style="{ background: bin.tagBg, color: bin.tagColor }">{{ bin.tag }}</span>
                  </div>
                </div>
              </div>
              <div class="split-count" style="color: var(--vp-c-brand-3)">{{ currentScenario.after.length }} bins &middot; organized</div>
            </div>
          </div>

          <!-- Divider line -->
          <svg class="split-divider-svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line
              ref="dividerLineEl"
              x1="55" y1="0" x2="55" y2="100"
              stroke="var(--vp-c-brand-1)" stroke-width="2" vector-effect="non-scaling-stroke"
            />
          </svg>
        </div>

        <!-- Mobile: Stacked cards -->
        <div class="scroll-reveal grid gap-4 md:hidden">
          <div class="mobile-section">
            <div class="split-badge split-badge--before" style="position: static; margin-bottom: 0.5rem">Before</div>
            <div
              v-for="bin in currentScenario.before.slice(0, 3)"
              :key="bin.name"
              class="messy-card"
              :style="{ transform: bin.tilt }"
            >
              <div class="messy-card-name">{{ bin.name }}</div>
              <div class="messy-card-items">{{ bin.items }}</div>
            </div>
          </div>
          <div class="mobile-section mobile-section--after">
            <div class="split-badge split-badge--after" style="position: static; margin-bottom: 0.5rem">After</div>
            <div class="mobile-clean-grid">
              <div
                v-for="bin in currentScenario.after.slice(0, 3)"
                :key="bin.name"
                class="bin-card"
                :style="{ background: bin.bg }"
              >
                <div class="bin-card-name">{{ bin.name }}</div>
                <div class="bin-card-area">{{ bin.area }}</div>
                <div class="bin-card-items">{{ bin.items }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ Ask AI Terminal ════════ -->
    <section class="px-6 py-16" style="background: var(--vp-c-bg-soft)">
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="display-heading scroll-reveal mb-4 text-3xl lg:text-4xl">
          Natural language commands
        </h2>
        <p class="scroll-reveal mb-10 text-lg" style="color: var(--vp-c-text-2)">
          Tell it what to do in plain English.
        </p>

        <div ref="termEl" class="term">
          <div class="term-content" :class="{ 'term-content--fade': transitioning }">
            <div class="term-line">
              <span class="term-prompt">&gt;</span>
              <span class="term-cmd">{{ typedText }}</span>
              <span class="term-cursor" :class="{ 'term-cursor--hidden': phase >= 2 }">|</span>
            </div>

            <div v-if="phase >= 2" class="term-line term-thinking">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="term-sparkle">
                <path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/>
              </svg>
              <span v-if="phase === 2">{{ sim.thinking }}</span>
              <span v-else>{{ sim.streaming(visibleLines) }}</span>
            </div>

            <template v-if="phase >= 3">
              <div
                v-for="(line, i) in sim.results"
                :key="i"
                class="term-result"
                :class="{ 'term-result--visible': i < visibleLines }"
              >
                <span class="term-result-name">{{ line.label }}</span>
                <span v-if="line.detail" class="term-result-items">{{ line.detail }}</span>
              </div>
            </template>

            <div v-if="phase === 4" class="term-line term-done">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              <span>{{ sim.done }}</span>
            </div>
          </div>
        </div>

        <div class="term-dots">
          <span
            v-for="(_, i) in sims"
            :key="i"
            class="term-dot"
            :class="{ 'term-dot--active': i === currentSimIndex }"
          />
        </div>
      </div>
    </section>

    <!-- ════════ Use Cases (tilted cards) ════════ -->
    <section class="px-6 py-16">
      <div class="mx-auto max-w-6xl">
        <h2
          class="display-heading scroll-reveal mb-10 text-center text-3xl lg:text-4xl"
        >
          Built for real life
        </h2>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            class="feature-card tilt-reveal stagger-1 rounded-lg p-8"
            style="--tilt: -1.5deg; background: var(--vp-c-bg)"
          >
            <svg class="mb-4" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--vp-c-brand-1)">
              <path d="m7.5 4.27 9 5.15" />
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
            <h3 class="text-xl font-semibold">Moving</h3>
            <p class="mt-2">Know what's in every box before you open it.</p>
          </div>
          <div
            class="feature-card tilt-reveal stagger-2 rounded-lg p-8"
            style="--tilt: 1deg; background: var(--vp-c-bg)"
          >
            <svg class="mb-4" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--vp-c-brand-1)">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
            </svg>
            <h3 class="text-xl font-semibold">Workshop</h3>
            <p class="mt-2">Find the right part bin without digging through drawers.</p>
          </div>
          <div
            class="feature-card tilt-reveal stagger-3 rounded-lg p-8"
            style="--tilt: -0.5deg; background: var(--vp-c-bg)"
          >
            <svg class="mb-4" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--vp-c-brand-1)">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h3 class="text-xl font-semibold">Shared spaces</h3>
            <p class="mt-2">One inventory for the whole household or team.</p>
          </div>
          <div
            class="feature-card tilt-reveal stagger-4 rounded-lg p-8"
            style="--tilt: 1.5deg; background: var(--vp-c-bg)"
          >
            <svg class="mb-4" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--vp-c-brand-1)">
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
            <h3 class="text-xl font-semibold">Collections</h3>
            <p class="mt-2">Catalog board games, LEGO sets, craft supplies, tools.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section divider -->
    <div class="section-divider"></div>

    <!-- ════════ Self-Host vs Cloud ════════ -->
    <section class="px-6 py-16">
      <div class="mx-auto max-w-5xl">
        <h2
          class="display-heading scroll-reveal mb-10 text-center text-3xl lg:text-4xl"
        >
          Choose how you run it
        </h2>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div
            class="scroll-slide-left rounded-lg p-8 text-left"
            style="border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft)"
          >
            <h3 class="text-2xl font-semibold">Self-Host</h3>
            <p class="mt-4 text-lg">
              Free forever. One Docker container, your hardware. You own the
              data and the backups.
            </p>
            <ul class="pricing-list mt-6 space-y-3">
              <li class="flex items-start gap-2 text-sm">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" style="color: var(--vp-c-brand-1)"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Single Docker container</span>
              </li>
              <li class="flex items-start gap-2 text-sm">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" style="color: var(--vp-c-brand-1)"><polyline points="20 6 9 17 4 12" /></svg>
                <span>SQLite — no external database</span>
              </li>
              <li class="flex items-start gap-2 text-sm">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" style="color: var(--vp-c-brand-1)"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Automatic backups</span>
              </li>
              <li class="flex items-start gap-2 text-sm">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" style="color: var(--vp-c-brand-1)"><polyline points="20 6 9 17 4 12" /></svg>
                <span>All features included</span>
              </li>
            </ul>
            <div class="mt-8">
              <a
                href="/docs/getting-started/"
                class="btn-secondary"
              >
                Get Started <span class="btn-arrow">&rarr;</span>
              </a>
            </div>
          </div>

          <div
            class="scroll-slide-right rounded-lg p-8 text-left"
            style="border: 1px solid var(--vp-c-brand-1); background: var(--vp-c-bg-soft)"
          >
            <h3 class="text-2xl font-semibold">Cloud</h3>
            <p class="mt-2 text-sm font-medium" style="color: var(--vp-c-brand-3)">From $5/mo</p>
            <p class="mt-3 text-lg">
              We run it, you use it. No server, no Docker, no maintenance.
              Just sign up.
            </p>
            <ul class="pricing-list mt-6 space-y-3">
              <li class="flex items-start gap-2 text-sm">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" style="color: var(--vp-c-brand-1)"><polyline points="20 6 9 17 4 12" /></svg>
                <span>No setup or maintenance</span>
              </li>
              <li class="flex items-start gap-2 text-sm">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" style="color: var(--vp-c-brand-1)"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Automatic updates</span>
              </li>
              <li class="flex items-start gap-2 text-sm">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" style="color: var(--vp-c-brand-1)"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Managed backups</span>
              </li>
              <li class="flex items-start gap-2 text-sm">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" style="color: var(--vp-c-brand-1)"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Priority support</span>
              </li>
            </ul>
            <div class="mt-8 flex flex-wrap items-center gap-4">
              <a href="https://cloud.openbin.app/" class="btn-primary">
                Try Cloud <span class="btn-arrow">&rarr;</span>
              </a>
              <a href="/pricing" class="text-sm font-medium" style="color: var(--vp-c-brand-3); text-decoration: underline; text-underline-offset: 2px">
                See pricing
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ FAQ ════════ -->
    <section class="px-6 py-16" style="background: var(--vp-c-bg-soft)">
      <div class="mx-auto max-w-3xl">
        <h2
          class="display-heading scroll-reveal mb-10 text-center text-3xl lg:text-4xl"
        >
          Questions
        </h2>
        <div class="scroll-reveal">
          <div v-for="(faq, i) in faqs" :key="i" class="faq-item">
            <button
              :id="'home-faq-btn-' + i"
              class="flex w-full items-center justify-between py-4 text-left"
              :aria-expanded="openFaq === i"
              :aria-controls="'home-faq-' + i"
              @click="toggleFaq(i)"
            >
              <span class="pr-4 text-lg font-semibold">{{ faq.q }}</span>
              <svg
                aria-hidden="true"
                class="faq-chevron shrink-0"
                :class="{ 'faq-chevron--open': openFaq === i }"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div :id="'home-faq-' + i" role="region" :aria-labelledby="'home-faq-btn-' + i" class="faq-answer" :class="{ 'faq-answer--open': openFaq === i }">
              <div class="overflow-hidden">
                <p class="pb-4">{{ faq.a }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ Bottom CTA ════════ -->
    <section class="cta-bg px-6 py-16 text-center">
      <h2
        class="display-heading scroll-reveal text-3xl lg:text-4xl"
      >
        Stop searching. Start finding.
      </h2>
      <p class="scroll-reveal mx-auto mt-4 max-w-xl text-lg">
        Free to self-host. Cloud if you'd rather not.
      </p>
      <div class="scroll-reveal mt-8 flex flex-wrap justify-center gap-4">
        <a href="/docs/getting-started/" class="btn-primary">
          Get Started <span class="btn-arrow">&rarr;</span>
        </a>
        <a href="https://cloud.openbin.app/" class="btn-secondary">
          Try Cloud <span class="btn-arrow">&rarr;</span>
        </a>
      </div>
    </section>
  </div>
</template>

<style>
/* ── AI Reorganization Split ── */
.scenario-picker {
  display: inline-flex;
  gap: 0.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 3px;
}
.scenario-btn {
  padding: 0.625rem 0.875rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
}
.scenario-btn:hover { color: var(--vp-c-text-1); }
.scenario-btn:focus-visible { outline: 2px solid var(--vp-c-brand-3); outline-offset: 2px; }
.scenario-btn--active { color: var(--vp-c-text-1); background: var(--vp-c-bg-soft); }

.split-container {
  position: relative;
  height: 30rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  cursor: default;
  user-select: none;
}
.split-panel { position: absolute; inset: 0; }
.split-panel--before { z-index: 1; background: var(--vp-c-bg-soft); }
.split-panel--after { z-index: 2; background: var(--vp-c-bg); }

.split-half {
  position: absolute;
  top: 0; bottom: 0;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 1.25rem;
}
.split-half--left { left: 0; }
.split-half--right { right: 0; }

.split-badge {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 2px 10px;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  align-self: flex-start;
}
.split-badge--before { color: var(--vp-c-text-3); border: 1px solid var(--vp-c-divider); }
.split-badge--after { color: var(--vp-c-brand-1); border: 1px solid var(--vp-c-brand-1); }

.split-count {
  font-size: 0.65rem;
  color: var(--vp-c-text-3);
  margin-top: 0.75rem;
  align-self: flex-start;
}

.messy-stack { display: grid; grid-template-columns: 1fr 1fr; gap: 0.25rem; width: 100%; }
.messy-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0.3rem 0.6rem;
  background: var(--vp-c-bg);
  text-align: left;
}
.messy-card-name { font-weight: 600; font-size: 0.75rem; color: var(--vp-c-text-1); }
.messy-card-items { font-size: 0.625rem; color: var(--vp-c-text-3); line-height: 1.35; margin-top: 1px; }

.clean-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.375rem; width: 100%; }
.bin-card { border-radius: 10px; padding: 0.6rem 0.75rem; text-align: left; position: relative; min-width: 0; }
.bin-card-icon { position: absolute; top: 0.6rem; right: 0.65rem; width: 20px; height: 20px; color: rgba(255,255,255,0.25); }
.bin-card-name { font-weight: 700; font-size: 0.8rem; color: #f0f0f5; line-height: 1.2; padding-right: 1.25rem; }
.bin-card-area { font-size: 0.575rem; color: rgba(255,255,255,0.35); margin-top: -1px; }
.bin-card-items { font-size: 0.575rem; color: rgba(255,255,255,0.4); line-height: 1.3; margin-top: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bin-card-tags { display: flex; gap: 0.2rem; margin-top: 0.375rem; flex-wrap: wrap; }
.bin-tag { padding: 1px 6px; font-size: 0.5rem; font-weight: 500; border-radius: 4px; white-space: nowrap; }

.callout {
  position: absolute; top: 0; bottom: 0; width: 50%;
  display: flex; flex-direction: column; justify-content: center;
  padding: 2rem; pointer-events: none; transition: opacity 0.05s linear;
}
.callout--before { right: 0; align-items: flex-start; padding-left: 2.5rem; }
.callout--after { left: 0; align-items: flex-end; text-align: right; padding-right: 2.5rem; }
.callout-big { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 700; font-size: 2.75rem; line-height: 1; letter-spacing: -0.03em; color: var(--vp-c-text-1); }
.callout-label { font-size: 0.9rem; font-weight: 500; color: var(--vp-c-text-2); margin-top: 0.125rem; margin-bottom: 0.5rem; }
.callout-detail { font-size: 0.75rem; color: var(--vp-c-text-3); margin-top: 0.25rem; }

.split-divider-svg { position: absolute; inset: 0; z-index: 5; pointer-events: none; }

.mobile-section {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 0.875rem;
  background: var(--vp-c-bg-soft);
  display: flex; flex-direction: column; gap: 0.375rem;
}
.mobile-section--after { background: var(--vp-c-bg); }
.mobile-clean-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.375rem; }
@media (max-width: 400px) {
  .mobile-clean-grid { grid-template-columns: 1fr; }
}

/* ── Ask AI Terminal ── */
.term {
  text-align: left;
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 0.85rem;
  line-height: 1.7;
  padding: 1.5rem 1.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  min-height: 220px;
}
.term-content { transition: opacity 0.4s ease; }
.term-content--fade { opacity: 0; }
.term-line { display: flex; align-items: center; gap: 0.5rem; }
.term-prompt { color: var(--vp-c-brand-1); font-weight: 700; }
.term-cmd { color: var(--vp-c-text-1); }
.term-cursor { color: var(--vp-c-brand-1); animation: term-blink 1s step-end infinite; }
.term-cursor--hidden { opacity: 0; animation: none; }
@keyframes term-blink { 50% { opacity: 0; } }
.term-thinking { color: var(--vp-c-text-3); margin-top: 0.75rem; animation: term-fade-in 0.3s ease; }
.term-sparkle { color: var(--vp-c-brand-1); flex-shrink: 0; }
.term-result {
  display: flex; align-items: baseline; gap: 1rem;
  padding: 0.25rem 0 0.25rem 1.25rem;
  opacity: 0; transform: translateY(4px);
  transition: opacity 0.25s, transform 0.25s;
}
.term-result--visible { opacity: 1; transform: none; }
.term-result-name { color: var(--vp-c-brand-3); font-weight: 600; min-width: 110px; }
.term-result-items { color: var(--vp-c-text-3); }
.term-done { margin-top: 0.75rem; color: #22c55e; animation: term-fade-in 0.3s ease; }
.term-done svg { flex-shrink: 0; }
@keyframes term-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.term-dots { display: flex; justify-content: center; gap: 8px; margin-top: 16px; }
.term-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--vp-c-divider); transition: background 0.3s, transform 0.3s; }
.term-dot--active { background: var(--vp-c-brand-1); transform: scale(1.5); }

@media (max-width: 640px) {
  .term { font-size: 0.75rem; padding: 1rem 1.25rem; }
  .term-result { flex-direction: column; gap: 0; }
  .term-result-name { min-width: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .term-cursor { animation: none; }
  .term-result { transition: none; opacity: 1; transform: none; }
  .term-thinking, .term-done { animation: none; }
  .term-content { transition: none; }
  .term-dot { transition: none; }
}
</style>
