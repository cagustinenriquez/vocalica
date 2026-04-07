import os
import tempfile

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

app = FastAPI(title="Vocalica API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/clone-voice")
async def clone_voice(
    file: UploadFile = File(...),
    text: str = Form(...),
    language: str = Form("es-AR"),
    voice_name: str = Form(""),
):
    """
    Receives a voice sample + text and returns synthesized audio.

    TODO: replace the placeholder below with a real TTS call, e.g.:
        from xtts import synthesize
        output_path = synthesize(audio_path, text, language)
    """
    content = await file.read()
    suffix = os.path.splitext(file.filename or "audio")[1] or ".wav"

    # Write upload to a temp file so the TTS model can read it
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(content)
        audio_path = tmp.name

    # --- Placeholder: echo the upload back ---
    # Replace this block with your TTS engine call.
    output_path = audio_path
    # -----------------------------------------

    return FileResponse(
        output_path,
        media_type=file.content_type or "audio/wav",
        filename=f"vocalica-{voice_name or 'output'}{suffix}",
    )
