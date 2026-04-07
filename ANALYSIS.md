# Vocalica — Project Analysis

## Overview

**Vocalica** (internally "Voz Clon AR") is a React demo frontend for a voice cloning web app targeting the Argentinian Spanish (`es-AR`) market. It is a UI-only prototype — the backend call is stubbed out and must still be wired in.

---

## File Structure

```
vocalica/
├── README.md        — Setup notes and API contract
└── src/
    └── App.jsx      — Entire app in a single React component
```

Minimal footprint: one component, no routing, no state management library.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Framework | React (functional components + hooks)   |
| UI        | shadcn/ui (`Card`, `Button`, `Input`, `Textarea`, `Badge`, `Progress`, `Switch`, `Separator`) |
| Icons     | lucide-react                            |
| Animation | framer-motion                           |
| Styling   | Tailwind CSS                            |
| Backend   | **Not yet connected** (FastAPI expected) |
| TTS Model | **Not yet integrated** (XTTS / F5-TTS suggested) |

---

## Core Features (UI)

1. **Audio upload** — accepts `.mp3`, `.wav`, `.ogg`, `.m4a`; creates a local object URL for preview
2. **Voice naming** — user labels the cloned voice (e.g. "Buenos Aires narrator")
3. **Text input** — textarea with live word count and estimated audio duration (~2.4 words/sec)
4. **Consent toggle** — ethical gate; generation is disabled without it
5. **Simulated generation** — fake progress bar (steps: 8→18→29→46→58→71→84→96→100%) over ~3.5s using `setTimeout`
6. **Result panel** — play / pause / download the generated audio (currently returns the original upload as a demo placeholder)
7. **API snippet card** — live-updated `POST /api/clone-voice` code block with one-click copy

---

## State

| State variable    | Purpose                                      |
|-------------------|----------------------------------------------|
| `audioFile`       | Uploaded `File` object                       |
| `audioUrl`        | Local object URL of the upload               |
| `text`            | Text to synthesize                           |
| `voiceName`       | Label for the voice                          |
| `isGenerating`    | Controls loading state / button disabled     |
| `progress`        | 0–100 value for the progress bar             |
| `generatedUrl`    | URL of the result audio (placeholder for now)|
| `isPlayingInput`  | Play/pause state of the input audio player   |
| `isPlayingOutput` | Play/pause state of the output audio player  |
| `consentChecked`  | Ethical consent toggle                       |
| `copied`          | Clipboard copy feedback (1.6s flash)         |

---

## What Still Needs to Be Built

### Backend (priority)
- `POST /api/clone-voice` endpoint (FastAPI recommended)
  - Accepts: `file` (audio), `text`, `language=es-AR`, `voice_name`
  - Returns: WAV or MP3 blob
- TTS engine with voice cloning support and strong Spanish performance (XTTS, F5-TTS, or similar)

### Frontend wiring
- Uncomment and connect the `fetch` block inside `handleGenerate` (lines 85–92 of `App.jsx`)
- Replace the demo placeholder `const url = audioUrl` (line 95) with the real response URL

### Optional improvements
- Error handling for failed API calls
- Audio format validation on upload
- Real audio duration display (using the Web Audio API or `<audio>` `loadedmetadata` event)
- Internationalization of UI strings (currently English labels, Spanish-targeted product)

---

## Key Design Decisions

- **Single-component architecture** — everything in `App.jsx`; simple to demo, will need splitting as features grow
- **Consent gate** — generation button is disabled without the consent switch, enforcing ethical use at the UI level
- **Object URL memory management** — `URL.revokeObjectURL` is called on new upload, preventing memory leaks
- **Estimated duration** — computed via `useMemo` at ~2.4 words/second, a reasonable average for Spanish TTS

---

## Suggested Next Steps

1. Stand up a FastAPI server with an XTTS or F5-TTS endpoint
2. Wire the frontend `fetch` call (already scaffolded in comments)
3. Add real error UI for backend failures
4. Split `App.jsx` into smaller components (`AudioUploader`, `TextForm`, `ResultPanel`, `ApiSnippet`)
