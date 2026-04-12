<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// ── Scroll reveal observer ──
let scrollObserver = null

// ── Photo Analysis Deep Dive Demo ──
const photoEl = ref(null)
const photoPhase = ref(0)
const photoItems = ref(0)
const photoTypedName = ref('')
const photoReanalyzed = ref(false)
let photoTimers = []
let photoStarted = false

const photoDemo = {
  name: 'Holiday Decorations',
  items: [
    { n: 'String lights', q: '×3', changed: false },
    { n: 'Ornaments box', q: '×1', changed: false },
    { n: 'Wrapping paper', q: '×4', changed: false },
    { n: 'Garland', q: '×2', changed: false },
  ],
  reanalyzed: [
    { n: 'String lights (LED)', q: '×3', changed: true },
    { n: 'Ornaments box', q: '×1', changed: false },
    { n: 'Wrapping paper rolls', q: '×6', changed: true },
    { n: 'Garland', q: '×2', changed: false },
  ],
  tags: ['holiday', 'seasonal'],
}

function clearPhotoTimers() {
  photoTimers.forEach(t => { clearTimeout(t); clearInterval(t) })
  photoTimers = []
}

function pTimer(fn, ms) {
  const id = setTimeout(fn, ms)
  photoTimers.push(id)
  return id
}

function runPhotoDemo() {
  clearPhotoTimers()
  photoPhase.value = 1
  photoItems.value = 0
  photoTypedName.value = ''
  photoReanalyzed.value = false

  // Type name
  let ci = 0
  const name = photoDemo.name
  const typeInt = setInterval(() => {
    if (ci < name.length) { photoTypedName.value = name.slice(0, ci + 1); ci++ }
    else clearInterval(typeInt)
  }, 35)
  photoTimers.push(typeInt)

  const nameTime = name.length * 35 + 200
  // Stream items
  for (let i = 1; i <= photoDemo.items.length; i++) {
    pTimer(() => { photoItems.value = i }, nameTime + i * 200)
  }

  const streamDone = nameTime + photoDemo.items.length * 200 + 600

  // Show tags
  pTimer(() => { photoPhase.value = 2 }, streamDone)

  // Re-analyze
  pTimer(() => {
    photoPhase.value = 3
    photoItems.value = 0
    pTimer(() => {
      photoReanalyzed.value = true
      for (let i = 1; i <= photoDemo.reanalyzed.length; i++) {
        pTimer(() => { photoItems.value = i }, i * 200)
      }
      pTimer(() => { photoPhase.value = 4 }, photoDemo.reanalyzed.length * 200 + 400)
    }, 800)
  }, streamDone + 2000)

  // Restart
  pTimer(() => {
    photoPhase.value = 0
    pTimer(runPhotoDemo, 600)
  }, streamDone + 2000 + 800 + photoDemo.reanalyzed.length * 200 + 3000)
}

const currentPhotoItems = computed(() => photoReanalyzed.value ? photoDemo.reanalyzed : photoDemo.items)

// ── AI Assistant Terminal Demo ──
const termEl = ref(null)
const termPhase = ref(0)
const termSimIndex = ref(0)
const termTyped = ref('')
const termLines = ref(0)
const termTransitioning = ref(false)
let termTimers = []
let termStarted = false

const termSims = [
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

const termSim = computed(() => termSims[termSimIndex.value])

function clearTermTimers() {
  termTimers.forEach(t => { clearTimeout(t); clearInterval(t) })
  termTimers = []
}

function tTimer(fn, ms) {
  const id = setTimeout(fn, ms)
  termTimers.push(id)
  return id
}

function runTermSim() {
  clearTermTimers()
  termPhase.value = 1
  termTyped.value = ''
  termLines.value = 0
  let i = 0
  const cmd = termSim.value.command
  const typeInterval = setInterval(() => {
    if (i < cmd.length) { termTyped.value = cmd.slice(0, i + 1); i++ }
    else {
      clearInterval(typeInterval)
      tTimer(() => {
        termPhase.value = 2
        tTimer(() => {
          termPhase.value = 3
          let line = 0
          const lineInterval = setInterval(() => {
            if (line < termSim.value.results.length) { termLines.value = line + 1; line++ }
            else {
              clearInterval(lineInterval)
              tTimer(() => {
                termPhase.value = 4
                tTimer(() => {
                  termTransitioning.value = true
                  tTimer(() => {
                    termSimIndex.value = (termSimIndex.value + 1) % termSims.length
                    termPhase.value = 0; termTyped.value = ''; termLines.value = 0
                    termTransitioning.value = false
                    tTimer(runTermSim, 600)
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

// ── AI Reorganization Split Demo ──
const splitContainerEl = ref(null)
const splitBeforeEl = ref(null)
const splitAfterEl = ref(null)
const splitDividerEl = ref(null)
const splitX = ref(45)
const splitScenario = ref(0)

const splitScenarios = [
  {
    label: 'Garage Cleanout',
    before: [
      { name: 'Stuff from garage', items: 'drill, tape, screws, batteries, rope', tilt: 'rotate(-3.5deg) translate(-6px, -2px)' },
      { name: 'Kitchen junk drawer', items: 'spatula, batteries, tape measure', tilt: 'rotate(2.5deg) translate(8px, 0)' },
      { name: 'Random drawer', items: 'scissors, screwdriver, string, super glue', tilt: 'rotate(-1.5deg) translate(-4px, 2px)' },
      { name: 'Under the sink', items: 'sponges, trash bags, detergent, rags', tilt: 'rotate(1.5deg) translate(4px, -1px)' },
      { name: 'Box #7', items: 'cables, adapters, zip ties, velcro', tilt: 'rotate(-2deg) translate(-2px, 1px)' },
    ],
    after: [
      { name: 'Power Tools', area: 'Garage', items: 'drill, screwdriver, clamps', bg: 'linear-gradient(135deg, color-mix(in oklch, #3b82f6 50%, #1a1a2e), color-mix(in oklch, #2563eb 30%, #1a1a2e))', tag: 'workshop', tagBg: 'rgba(59,130,246,0.3)', tagColor: '#93c5fd', icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z' },
      { name: 'Hardware', area: 'Garage', items: 'screws, nails, tape, rope, zip ties', bg: 'linear-gradient(135deg, color-mix(in oklch, #f59e0b 45%, #1a1a2e), color-mix(in oklch, #d97706 28%, #1a1a2e))', tag: 'supplies', tagBg: 'rgba(245,158,11,0.3)', tagColor: '#fcd34d', icon: 'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z' },
      { name: 'Kitchen & Cleaning', area: 'Kitchen', items: 'spatula, sponges, detergent, rags', bg: 'linear-gradient(135deg, color-mix(in oklch, #22c55e 45%, #1a1a2e), color-mix(in oklch, #16a34a 28%, #1a1a2e))', tag: 'kitchen', tagBg: 'rgba(34,197,94,0.3)', tagColor: '#86efac', icon: 'M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z' },
      { name: 'Electrical', area: 'Garage', items: 'batteries, lightbulbs, cables, adapters', bg: 'linear-gradient(135deg, color-mix(in oklch, #a855f7 45%, #1a1a2e), color-mix(in oklch, #7c3aed 28%, #1a1a2e))', tag: 'electrical', tagBg: 'rgba(168,85,247,0.3)', tagColor: '#c4b5fd', icon: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z' },
    ],
  },
  {
    label: 'Moving Day',
    before: [
      { name: 'Living Room Box 1', items: 'books, remote, coasters, candles', tilt: 'rotate(-2deg) translate(-4px, -3px)' },
      { name: 'Bedroom Stuff', items: 'alarm clock, lamp, extension cord, novels', tilt: 'rotate(3deg) translate(4px, 0)' },
      { name: 'Junk Drawer', items: 'batteries, tape, scissors, pens', tilt: 'rotate(2deg) translate(3px, -2px)' },
      { name: 'Bathroom Box', items: 'towels, first aid kit, medicine', tilt: 'rotate(-2.5deg) translate(-5px, 0)' },
      { name: 'Kitchen Box 1', items: 'spatula, whisk, measuring cups, timer', tilt: 'rotate(1deg) translate(2px, 3px)' },
    ],
    after: [
      { name: 'Books & Media', area: 'Living Room', items: 'books, novels, remote, coasters', bg: 'linear-gradient(135deg, color-mix(in oklch, #6366f1 50%, #1a1a2e), color-mix(in oklch, #4f46e5 30%, #1a1a2e))', tag: 'media', tagBg: 'rgba(99,102,241,0.3)', tagColor: '#a5b4fc', icon: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20' },
      { name: 'First Aid & Bath', area: 'Bathroom', items: 'first aid kit, medicine, towels', bg: 'linear-gradient(135deg, color-mix(in oklch, #ef4444 45%, #1a1a2e), color-mix(in oklch, #dc2626 28%, #1a1a2e))', tag: 'health', tagBg: 'rgba(239,68,68,0.3)', tagColor: '#fca5a5', icon: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' },
      { name: 'Kitchen', area: 'Kitchen', items: 'spatula, whisk, measuring cups, timer', bg: 'linear-gradient(135deg, color-mix(in oklch, #22c55e 45%, #1a1a2e), color-mix(in oklch, #16a34a 28%, #1a1a2e))', tag: 'kitchen', tagBg: 'rgba(34,197,94,0.3)', tagColor: '#86efac', icon: 'M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z' },
      { name: 'Office & Craft', area: 'Office', items: 'pens, tape, scissors, rubber bands', bg: 'linear-gradient(135deg, color-mix(in oklch, #14b8a6 45%, #1a1a2e), color-mix(in oklch, #0d9488 28%, #1a1a2e))', tag: 'office', tagBg: 'rgba(20,184,166,0.3)', tagColor: '#5eead4', icon: 'M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z' },
    ],
  },
  {
    label: 'Workshop',
    before: [
      { name: 'Bin A — Finishing', items: 'sandpaper, wood glue, paint brushes', tilt: 'rotate(-2.5deg) translate(-5px, -1px)' },
      { name: 'Bin B — Mixed', items: 'drill bits, screws, nails, wall anchors', tilt: 'rotate(2deg) translate(6px, 2px)' },
      { name: 'Old toolbox', items: 'pliers, wrench set, hex keys', tilt: 'rotate(-1deg) translate(-3px, 3px)' },
      { name: 'Shelf stuff', items: 'safety glasses, ear plugs, dust masks', tilt: 'rotate(1.5deg) translate(4px, 0)' },
      { name: 'Peg board overflow', items: 'clamps, tape measure, level', tilt: 'rotate(2.5deg) translate(3px, 1px)' },
    ],
    after: [
      { name: 'Fasteners', area: 'Workshop', items: 'screws, nails, wall anchors', bg: 'linear-gradient(135deg, color-mix(in oklch, #f59e0b 45%, #1a1a2e), color-mix(in oklch, #d97706 28%, #1a1a2e))', tag: 'hardware', tagBg: 'rgba(245,158,11,0.3)', tagColor: '#fcd34d', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z' },
      { name: 'Hand Tools', area: 'Workshop', items: 'pliers, wrench set, hex keys, clamps', bg: 'linear-gradient(135deg, color-mix(in oklch, #3b82f6 50%, #1a1a2e), color-mix(in oklch, #2563eb 30%, #1a1a2e))', tag: 'tools', tagBg: 'rgba(59,130,246,0.3)', tagColor: '#93c5fd', icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z' },
      { name: 'Finishing', area: 'Workshop', items: 'sandpaper, wood glue, paint brushes', bg: 'linear-gradient(135deg, color-mix(in oklch, #22c55e 45%, #1a1a2e), color-mix(in oklch, #16a34a 28%, #1a1a2e))', tag: 'finishing', tagBg: 'rgba(34,197,94,0.3)', tagColor: '#86efac', icon: 'm9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08' },
      { name: 'Power Bits', area: 'Workshop', items: 'drill bits, router bits, jigsaw blades', bg: 'linear-gradient(135deg, color-mix(in oklch, #ec4899 45%, #1a1a2e), color-mix(in oklch, #db2777 28%, #1a1a2e))', tag: 'bits', tagBg: 'rgba(236,72,153,0.3)', tagColor: '#f9a8d4', icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
      { name: 'Safety Gear', area: 'Workshop', items: 'safety glasses, ear plugs, dust masks', bg: 'linear-gradient(135deg, color-mix(in oklch, #ef4444 45%, #1a1a2e), color-mix(in oklch, #dc2626 28%, #1a1a2e))', tag: 'safety', tagBg: 'rgba(239,68,68,0.3)', tagColor: '#fca5a5', icon: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z' },
    ],
  },
]

const currentSplit = computed(() => splitScenarios[splitScenario.value])

const SPRING = 6
let splitTargetX = 45, splitCurrentX = 45, splitLastFrame = 0, splitAnimId = null, splitUserHovering = false, splitSweepPhase = 0, splitVisible = false

function applySplitPos(pos) {
  const x = Math.max(0, Math.min(100, pos))
  splitX.value = x
  if (splitBeforeEl.value) splitBeforeEl.value.style.clipPath = `inset(0 ${100 - x}% 0 0)`
  if (splitAfterEl.value) splitAfterEl.value.style.clipPath = `inset(0 0 0 ${x}%)`
  if (splitDividerEl.value) {
    splitDividerEl.value.setAttribute('x1', x)
    splitDividerEl.value.setAttribute('x2', x)
  }
}

function splitTick(now) {
  if (!splitVisible) { splitAnimId = null; return }
  const dt = Math.min(0.05, (now - splitLastFrame) / 1000)
  splitLastFrame = now
  if (!splitUserHovering) { splitSweepPhase += dt * 0.35; splitTargetX = 45 + 20 * Math.sin(splitSweepPhase) }
  splitCurrentX += (splitTargetX - splitCurrentX) * (1 - Math.exp(-SPRING * dt))
  applySplitPos(splitCurrentX)
  splitAnimId = requestAnimationFrame(splitTick)
}

function onSplitPointerMove(e) {
  if (!splitContainerEl.value) return
  splitUserHovering = true
  const rect = splitContainerEl.value.getBoundingClientRect()
  splitTargetX = ((e.clientX - rect.left) / rect.width) * 100 < 50 ? 80 : 25
}

function onSplitPointerLeave() { splitUserHovering = false }

// ── Voice & Text Input Demo ──
const voiceEl = ref(null)
const voicePhase = ref(0) // 0=idle, 1=listening, 2=processing, 3=structured, 4=done
const voiceSimIndex = ref(0)
const voiceTypedText = ref('')
const voiceItems = ref(0)
let voiceTimers = []
let voiceStarted = false

const voiceSims = [
  {
    raw: 'uh three rolls of tape, some scissors, a couple of markers and oh also a stapler',
    items: [
      { n: 'Tape rolls', q: '×3' },
      { n: 'Scissors', q: '×1' },
      { n: 'Markers', q: '×2' },
      { n: 'Stapler', q: '×1' },
    ],
  },
  {
    raw: "let me see... there's a drill, drill bits I think twelve of them, and some sandpaper oh and wood glue",
    items: [
      { n: 'Drill', q: '×1' },
      { n: 'Drill bits', q: '×12' },
      { n: 'Sandpaper', q: '×1' },
      { n: 'Wood glue', q: '×1' },
    ],
  },
  {
    raw: 'batteries triple A I have like eight of them, double A maybe four, and a nine volt',
    items: [
      { n: 'AAA batteries', q: '×8' },
      { n: 'AA batteries', q: '×4' },
      { n: '9V battery', q: '×1' },
    ],
  },
]

const voiceSim = computed(() => voiceSims[voiceSimIndex.value])

function clearVoiceTimers() {
  voiceTimers.forEach(t => { clearTimeout(t); clearInterval(t) })
  voiceTimers = []
}

function vTimer(fn, ms) {
  const id = setTimeout(fn, ms)
  voiceTimers.push(id)
  return id
}

function runVoiceSim() {
  clearVoiceTimers()
  voicePhase.value = 1
  voiceTypedText.value = ''
  voiceItems.value = 0

  // Stream raw text
  let ci = 0
  const raw = voiceSim.value.raw
  const typeInt = setInterval(() => {
    if (ci < raw.length) { voiceTypedText.value = raw.slice(0, ci + 1); ci++ }
    else {
      clearInterval(typeInt)
      // Processing
      vTimer(() => {
        voicePhase.value = 2
        vTimer(() => {
          voicePhase.value = 3
          for (let i = 1; i <= voiceSim.value.items.length; i++) {
            vTimer(() => { voiceItems.value = i }, i * 250)
          }
          const itemsDone = voiceSim.value.items.length * 250 + 400
          vTimer(() => { voicePhase.value = 4 }, itemsDone)
          // Restart
          vTimer(() => {
            voicePhase.value = 0
            voiceSimIndex.value = (voiceSimIndex.value + 1) % voiceSims.length
            vTimer(runVoiceSim, 600)
          }, itemsDone + 2500)
        }, 800)
      }, 500)
    }
  }, 30)
  voiceTimers.push(typeInt)
}

// ── Lifecycle ──
onMounted(() => {
  const revealTargets = document.querySelectorAll(
    '.scroll-reveal, .scroll-slide-left, .scroll-slide-right, .scroll-scale-in'
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

  // Photo analysis deep dive observer
  if (photoEl.value) {
    const photoObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !photoStarted) {
          photoStarted = true
          runPhotoDemo()
          photoObs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    photoObs.observe(photoEl.value)
  }

  // Terminal demo observer
  if (termEl.value) {
    const termObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !termStarted) {
          termStarted = true
          runTermSim()
          termObs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    termObs.observe(termEl.value)
  }

  // Split divider animation
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    applySplitPos(55)
  } else if (splitContainerEl.value) {
    const splitObs = new IntersectionObserver(([entry]) => {
      splitVisible = entry.isIntersecting
      if (splitVisible && !splitAnimId) {
        splitLastFrame = performance.now()
        splitAnimId = requestAnimationFrame(splitTick)
      }
    }, { threshold: 0 })
    splitObs.observe(splitContainerEl.value)
  }

  // Voice demo observer
  if (voiceEl.value) {
    const voiceObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !voiceStarted) {
          voiceStarted = true
          runVoiceSim()
          voiceObs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    voiceObs.observe(voiceEl.value)
  }
})

onUnmounted(() => {
  if (scrollObserver) scrollObserver.disconnect()
  clearPhotoTimers()
  clearTermTimers()
  if (splitAnimId) cancelAnimationFrame(splitAnimId)
  clearVoiceTimers()
})
</script>

<template>
  <div class="home-layout">
    <!-- Animated background -->
    <div class="animated-bg" aria-hidden="true">
      <div class="animated-bg__orb animated-bg__orb--1"></div>
      <div class="animated-bg__orb animated-bg__orb--2"></div>
      <div class="animated-bg__orb animated-bg__orb--3"></div>
    </div>

    <!-- ════════ Hero ════════ -->
    <section class="hero-bg px-6 pt-16 pb-12 text-center">

      <h1 class="display-heading gradient-text animate-in delay-1 mx-auto mt-3 max-w-3xl text-4xl lg:text-6xl">
        Your inventory learns.
      </h1>
      <p class="animate-in delay-2 mx-auto mt-6 max-w-2xl text-lg lg:text-xl">
        Point your camera at a bin. AI identifies the items, suggests names and tags, and keeps everything organized as your space grows.
      </p>
      <div class="animate-in delay-3 mt-8 flex flex-wrap justify-center gap-4">
        <a href="/cloud" class="btn-primary">
          Start Free <span class="btn-arrow">&rarr;</span>
        </a>
        <a href="https://demo.openbin.app" target="_blank" rel="noopener" class="btn-secondary">
          Try Demo <span class="btn-arrow">&rarr;</span>
        </a>
      </div>
      <p class="animate-in delay-4 mt-4 text-center text-sm">
        7-day free trial &middot; No credit card required
      </p>
    </section>

    <!-- ════════ Without / With AI ════════ -->
    <section class="px-6 py-6">
      <div class="mx-auto max-w-5xl text-center">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Without -->
          <div class="scroll-reveal stagger-1 rounded-lg p-8 text-left" style="border: 1px solid rgba(239, 68, 68, 0.15); background: rgba(239, 68, 68, 0.04)">
            <div class="mb-4 text-xs font-semibold uppercase tracking-widest" style="color: #fca5a5">Without AI</div>
            <ul class="pricing-list space-y-3">
              <li class="flex items-start gap-3 text-sm">
                <span class="mt-0.5 shrink-0 font-bold" style="color: #ef4444" aria-hidden="true">&#x2717;</span>
                <span>Type every item name by hand</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <span class="mt-0.5 shrink-0 font-bold" style="color: #ef4444" aria-hidden="true">&#x2717;</span>
                <span>Guess at quantities and categories</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <span class="mt-0.5 shrink-0 font-bold" style="color: #ef4444" aria-hidden="true">&#x2717;</span>
                <span>Reorganize bins one at a time</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <span class="mt-0.5 shrink-0 font-bold" style="color: #ef4444" aria-hidden="true">&#x2717;</span>
                <span>Search by exact name only</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <span class="mt-0.5 shrink-0 font-bold" style="color: #ef4444" aria-hidden="true">&#x2717;</span>
                <span>Naming conventions drift over time</span>
              </li>
            </ul>
          </div>
          <!-- With -->
          <div class="scroll-reveal stagger-2 rounded-lg p-8 text-left" style="border: 1px solid rgba(94, 47, 224, 0.25); background: rgba(94, 47, 224, 0.06)">
            <div class="mb-4 text-xs font-semibold uppercase tracking-widest" style="color: var(--vp-c-brand-3)">With OpenBin AI</div>
            <ul class="pricing-list space-y-3">
              <li class="flex items-start gap-3 text-sm">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" style="color: var(--vp-c-brand-3)"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Snap a photo, AI names everything</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" style="color: var(--vp-c-brand-3)"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Tags suggested, quantities estimated when countable</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" style="color: var(--vp-c-brand-3)"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Reorganize an entire location at once</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" style="color: var(--vp-c-brand-3)"><polyline points="20 6 9 17 4 12" /></svg>
                <span>"Where did I put the holiday lights?"</span>
              </li>
              <li class="flex items-start gap-3 text-sm">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0" style="color: var(--vp-c-brand-3)"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Consistent naming across your whole inventory</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ Feature Deep Dives ════════ -->
    <section class="px-6 py-16" id="features">
      <div class="mx-auto max-w-5xl">
        <h2 class="display-heading scroll-reveal mb-12 text-center text-3xl lg:text-4xl">
          What AI can do
        </h2>

        <!-- Photo Analysis -->
        <div id="photo-analysis" class="scroll-reveal ai-feature-row">
          <div class="ai-feature-text">
            <div class="ai-feature-label" style="color: var(--vp-c-brand-3)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              Photo Analysis
            </div>
            <h3 class="display-heading mt-2 text-2xl">See it. Name it. Tag it.</h3>
            <p class="mt-3 text-base" style="color: var(--vp-c-text-2)">
              Upload a photo and AI identifies items and suggests tags. Quantities are estimated when items are clearly countable — review and adjust before saving. Re-analyze with a correction to refine results.
            </p>
            <div class="ai-pills mt-4">
              <span class="ai-pill" style="background: var(--vp-c-brand-soft); color: var(--vp-c-brand-3)">Multi-photo</span>
              <span class="ai-pill" style="background: var(--vp-c-brand-soft); color: var(--vp-c-brand-3)">Re-analyze</span>
              <span class="ai-pill" style="background: var(--vp-c-brand-soft); color: var(--vp-c-brand-3)">Quantity estimates</span>
              <span class="ai-pill" style="background: var(--vp-c-brand-soft); color: var(--vp-c-brand-3)">Bulk upload</span>
            </div>
          </div>
          <div ref="photoEl" class="ai-feature-demo">
            <div class="ai-demo-card">
              <div class="ai-demo-stream-row">
                <div class="ai-demo-stream-photo">
                  <div class="ai-demo-thumb-img ai-demo-thumb-lg" style="background: #5b3a6b"></div>
                  <div class="ai-shimmer" :class="{ 'ai-shimmer-on': photoPhase >= 1 && photoPhase < 2 || photoPhase === 3 }"></div>
                </div>
                <div class="ai-demo-stream-result">
                  <div class="ai-demo-bin-name">
                    {{ photoTypedName }}
                    <span v-if="photoPhase === 1 && photoItems < photoDemo.items.length" class="ai-demo-cursor">|</span>
                    <span v-if="photoPhase === 3 && !photoReanalyzed" class="ai-demo-scanning" style="display: inline-flex; font-size: 0.75rem; margin-left: 0.5rem">
                      <svg class="ai-demo-spinner" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--vp-c-brand-3)" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      Re-analyzing...
                    </span>
                  </div>
                  <div class="ai-demo-items">
                    <div
                      v-for="(item, i) in currentPhotoItems"
                      :key="(photoReanalyzed ? 'r-' : '') + item.n"
                      class="ai-demo-item"
                      :class="{ 'ai-demo-item-show': photoItems > i, 'ai-demo-item-changed': item.changed && photoReanalyzed }"
                    >
                      <span>{{ item.n }}</span>
                      <span class="ai-demo-qty">{{ item.q }}</span>
                    </div>
                  </div>
                  <div v-if="photoPhase >= 2" class="ai-demo-tags">
                    <span v-for="tag in photoDemo.tags" :key="tag" class="ai-demo-tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
              <div v-if="photoPhase >= 2 && photoPhase < 3" class="ai-demo-reanalyze-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--vp-c-brand-3)">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                  <path d="M21 21v-5h-5"/>
                </svg>
                Re-analyze
              </div>
              <div v-if="photoPhase >= 4" class="ai-demo-complete">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span>2 items refined</span>
              </div>
            </div>
          </div>
        </div>

        <div class="section-divider mx-auto my-12 max-w-3xl"></div>

        <!-- AI Assistant -->
        <div id="assistant" class="scroll-reveal ai-feature-row">
          <div ref="termEl" class="ai-feature-demo">
            <div class="term">
              <div class="term-content" :class="{ 'term-content--fade': termTransitioning }">
                <div class="term-line">
                  <span class="term-prompt">&gt;</span>
                  <span class="term-cmd">{{ termTyped }}</span>
                  <span class="term-cursor" :class="{ 'term-cursor--hidden': termPhase >= 2 }">|</span>
                </div>
                <div v-if="termPhase >= 2" class="term-line term-thinking">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="term-sparkle">
                    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/>
                  </svg>
                  <span v-if="termPhase === 2">{{ termSim.thinking }}</span>
                  <span v-else>{{ termSim.streaming(termLines) }}</span>
                </div>
                <template v-if="termPhase >= 3">
                  <div
                    v-for="(line, i) in termSim.results"
                    :key="i"
                    class="term-result"
                    :class="{ 'term-result--visible': i < termLines }"
                  >
                    <span class="term-result-name">{{ line.label }}</span>
                    <span v-if="line.detail" class="term-result-items">{{ line.detail }}</span>
                  </div>
                </template>
                <div v-if="termPhase === 4" class="term-line term-done">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  <span>{{ termSim.done }}</span>
                </div>
              </div>
            </div>
            <div class="term-dots">
              <span v-for="(_, i) in termSims" :key="i" class="term-dot" :class="{ 'term-dot--active': i === termSimIndex }" />
            </div>
          </div>
          <div class="ai-feature-text">
            <div class="ai-feature-label" style="color: #60a5fa">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H4a2 2 0 0 0-2 2v12l4-3h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>
              AI Assistant
            </div>
            <h3 class="display-heading mt-2 text-2xl">Just tell it what to do.</h3>
            <p class="mt-3 text-base" style="color: var(--vp-c-text-2)">
              Add items, move them between bins, search your inventory, or create new bins. Preview every action before confirming.
            </p>
            <div class="ai-pills mt-4">
              <span class="ai-pill" style="background: rgba(59, 130, 246, 0.1); color: #60a5fa">Search</span>
              <span class="ai-pill" style="background: rgba(59, 130, 246, 0.1); color: #60a5fa">Add / Move</span>
              <span class="ai-pill" style="background: rgba(59, 130, 246, 0.1); color: #60a5fa">Create</span>
              <span class="ai-pill" style="background: rgba(59, 130, 246, 0.1); color: #60a5fa">Tag</span>
              <span class="ai-pill" style="background: rgba(59, 130, 246, 0.1); color: #60a5fa">Bulk actions</span>
            </div>
          </div>
        </div>

        <div class="section-divider mx-auto my-12 max-w-3xl"></div>

        <!-- AI Reorganization -->
        <div id="reorganization" class="scroll-reveal ai-feature-row">
          <div class="ai-feature-text">
            <div class="ai-feature-label" style="color: #4ade80">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3H8l-4 4v8l4 4h8l4-4V7l-4-4z"/></svg>
              Reorganization
            </div>
            <h3 class="display-heading mt-2 text-2xl">Rethink an entire room.</h3>
            <p class="mt-3 text-base" style="color: var(--vp-c-text-2)">
              Select any set of bins and let AI propose a better structure — renaming, merging, splitting, and reassigning areas. Review every change side-by-side before applying.
            </p>
            <div class="ai-pills mt-4">
              <span class="ai-pill" style="background: rgba(34, 197, 94, 0.1); color: #4ade80">Bulk</span>
              <span class="ai-pill" style="background: rgba(34, 197, 94, 0.1); color: #4ade80">Side-by-side preview</span>
              <span class="ai-pill" style="background: rgba(34, 197, 94, 0.1); color: #4ade80">Custom rules</span>
              <span class="ai-pill" style="background: rgba(34, 197, 94, 0.1); color: #4ade80">Undo</span>
            </div>
            <!-- Scenario picker -->
            <div class="scenario-picker mt-6" role="radiogroup" aria-label="Reorganization scenario">
              <button
                v-for="(s, i) in splitScenarios"
                :key="s.label"
                role="radio"
                :aria-checked="splitScenario === i"
                class="scenario-btn"
                :class="{ 'scenario-btn--active': splitScenario === i }"
                @click="splitScenario = i"
              >
                {{ s.label }}
              </button>
            </div>
          </div>
          <div class="ai-feature-demo">
            <!-- Desktop split -->
            <div
              ref="splitContainerEl"
              class="split-container hidden md:block"
              style="height: 320px"
              @pointermove="onSplitPointerMove"
              @pointerleave="onSplitPointerLeave"
            >
              <div ref="splitBeforeEl" class="split-panel split-panel--before">
                <div class="split-half split-half--left">
                  <div class="messy-stack">
                    <div v-for="bin in currentSplit.before" :key="bin.name" class="messy-card" :style="{ transform: bin.tilt }">
                      <div class="messy-card-name">{{ bin.name }}</div>
                      <div class="messy-card-items">{{ bin.items }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div ref="splitAfterEl" class="split-panel split-panel--after">
                <div class="split-half split-half--right">
                  <div class="clean-grid">
                    <div v-for="bin in currentSplit.after" :key="bin.name" class="bin-card" :style="{ background: bin.bg }">
                      <svg class="bin-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="bin.icon"/></svg>
                      <div class="bin-card-name">{{ bin.name }}</div>
                      <div class="bin-card-area">{{ bin.area }}</div>
                      <div class="bin-card-items">{{ bin.items }}</div>
                      <div class="bin-card-tags"><span class="bin-tag" :style="{ background: bin.tagBg, color: bin.tagColor }">{{ bin.tag }}</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="split-divider-wrap">
                <svg class="split-divider-svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line ref="splitDividerEl" x1="45" y1="0" x2="45" y2="100" stroke="var(--vp-c-brand-1)" stroke-width="2" vector-effect="non-scaling-stroke"/>
                </svg>
                <div class="split-label split-label--before" :style="{ left: (splitX - 0.5) + '%' }">Before</div>
                <div class="split-label split-label--after" :style="{ left: (splitX + 0.5) + '%' }">After</div>
              </div>
            </div>
            <!-- Mobile stacked -->
            <div class="grid gap-4 md:hidden">
              <div>
                <div class="split-badge split-badge--before" style="position: static; margin-bottom: 0.5rem">Before</div>
                <div v-for="bin in currentSplit.before.slice(0, 3)" :key="bin.name" class="messy-card" :style="{ transform: bin.tilt }">
                  <div class="messy-card-name">{{ bin.name }}</div>
                  <div class="messy-card-items">{{ bin.items }}</div>
                </div>
              </div>
              <div>
                <div class="split-badge split-badge--after" style="position: static; margin-bottom: 0.5rem">After</div>
                <div class="mobile-clean-grid">
                  <div v-for="bin in currentSplit.after.slice(0, 3)" :key="bin.name" class="bin-card" :style="{ background: bin.bg }">
                    <div class="bin-card-name">{{ bin.name }}</div>
                    <div class="bin-card-area">{{ bin.area }}</div>
                    <div class="bin-card-items">{{ bin.items }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section-divider mx-auto my-12 max-w-3xl"></div>

        <!-- Voice & Text Input -->
        <div id="voice-text" class="scroll-reveal ai-feature-row">
          <div ref="voiceEl" class="ai-feature-demo">
            <div class="ai-demo-card" style="min-height: 300px">
              <!-- Waveform bars -->
              <div class="ai-wave" :class="{ 'ai-wave-active': voicePhase === 1 }">
                <span class="ai-wave-bar" style="animation-delay: 0s"></span>
                <span class="ai-wave-bar" style="animation-delay: 0.15s"></span>
                <span class="ai-wave-bar" style="animation-delay: 0.3s"></span>
                <span class="ai-wave-bar" style="animation-delay: 0.1s"></span>
              </div>
              <!-- Raw text -->
              <div v-if="voicePhase >= 1" class="ai-voice-raw">
                <span class="ai-voice-raw-text">{{ voiceTypedText }}</span>
                <span v-if="voicePhase === 1" class="ai-demo-cursor">|</span>
              </div>
              <!-- Processing divider -->
              <div v-if="voicePhase >= 2" class="ai-voice-divider" :class="{ 'ai-voice-divider-done': voicePhase >= 3 }">
                <svg v-if="voicePhase === 2" class="ai-demo-spinner" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--vp-c-brand-3)" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <span v-if="voicePhase === 2" style="font-size: 0.75rem; color: var(--vp-c-brand-3)">Structuring...</span>
              </div>
              <!-- Structured items -->
              <div v-if="voicePhase >= 3" class="ai-demo-items" style="margin-top: 0.5rem">
                <div
                  v-for="(item, i) in voiceSim.items"
                  :key="voiceSimIndex + '-' + item.n"
                  class="ai-demo-item"
                  :class="{ 'ai-demo-item-show': voiceItems > i }"
                >
                  <span>{{ item.n }}</span>
                  <span class="ai-demo-qty">{{ item.q }}</span>
                </div>
              </div>
              <!-- Done -->
              <div v-if="voicePhase >= 4" class="ai-demo-complete" style="margin-top: 0.75rem">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span>{{ voiceSim.items.length }} items extracted</span>
              </div>
            </div>
          </div>
          <div class="ai-feature-text">
            <div class="ai-feature-label" style="color: #fbbf24">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
              Voice & Text Input
            </div>
            <h3 class="display-heading mt-2 text-2xl">Talk. It listens.</h3>
            <p class="mt-3 text-base" style="color: var(--vp-c-text-2)">
              Dictate or type a messy list of items. AI extracts names, cleans up filler words, deduplicates, and normalizes quantities. Hands full of boxes? Just talk.
            </p>
            <div class="ai-pills mt-4">
              <span class="ai-pill" style="background: rgba(245, 158, 11, 0.1); color: #fbbf24">Dictation</span>
              <span class="ai-pill" style="background: rgba(245, 158, 11, 0.1); color: #fbbf24">Deduplication</span>
              <span class="ai-pill" style="background: rgba(245, 158, 11, 0.1); color: #fbbf24">Quantity extraction</span>
              <span class="ai-pill" style="background: rgba(245, 158, 11, 0.1); color: #fbbf24">Filler removal</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ Bottom CTA ════════ -->
    <section class="cta-bg px-6 py-16 text-center">
      <h2 class="display-heading scroll-reveal text-3xl lg:text-4xl">
        Try it yourself.
      </h2>
      <p class="scroll-reveal mt-4 text-lg" style="color: var(--vp-c-text-2)">
        AI features are free to try. Bring your own API key or start with Cloud.
      </p>
      <div class="scroll-reveal mt-8 flex flex-wrap justify-center gap-4">
        <a href="/cloud" class="btn-primary">
          Start Free <span class="btn-arrow">&rarr;</span>
        </a>
        <a href="https://demo.openbin.app" target="_blank" rel="noopener" class="btn-secondary">
          Try Demo <span class="btn-arrow">&rarr;</span>
        </a>
        <a href="/docs/" class="btn-secondary">
          Self-Host Docs <span class="btn-arrow">&rarr;</span>
        </a>
      </div>
    </section>
  </div>
</template>
