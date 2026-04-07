# Voz Clon AR Website

This archive contains the React frontend for a voice cloning website focused on Argentinian Spanish (`es-AR`).

## Included
- `src/App.jsx` — main React page/component

## Notes
- The UI is ready to upload an audio sample, accept input text, and simulate generation.
- The actual backend call is still commented inside `App.jsx`.
- The app is designed to connect to a real endpoint like:

```http
POST /api/clone-voice
Content-Type: multipart/form-data
```

Fields:
- `file`
- `text`
- `language=es-AR`
- `voice_name`

## Recommended stack
- Frontend: React + Tailwind
- Backend: FastAPI
- Model: XTTS / F5-TTS / similar voice cloning TTS
