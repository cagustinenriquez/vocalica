import os
import tempfile
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask
from TTS.api import TTS  # pip install TTS


MODEL_NAME = "tts_models/multilingual/multi-dataset/xtts_v2"
tts_model: TTS | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global tts_model
    tts_model = TTS(MODEL_NAME)
    yield
    tts_model = None


app = FastAPI(title="Vocalica API", lifespan=lifespan)

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
    content = await file.read()
    suffix = os.path.splitext(file.filename or "audio")[1] or ".wav"

    # XTTS uses ISO 639-1 codes; strip the region tag
    lang_code = language.split("-")[0]

    input_tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    output_tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    try:
        input_tmp.write(content)
        input_tmp.close()
        output_tmp.close()

        assert tts_model is not None
        tts_model.tts_to_file(
            text=text,
            speaker_wav=input_tmp.name,
            language=lang_code,
            file_path=output_tmp.name,
        )
    except Exception as exc:
        os.unlink(input_tmp.name)
        os.unlink(output_tmp.name)
        raise HTTPException(status_code=500, detail=str(exc))
    finally:
        # Always clean up the input temp file
        if os.path.exists(input_tmp.name):
            os.unlink(input_tmp.name)

    # FileResponse streams the file; clean up after the response is sent
    def _delete_output():
        try:
            os.unlink(output_tmp.name)
        except OSError:
            pass

    return FileResponse(
        output_tmp.name,
        media_type="audio/wav",
        filename=f"vocalica-{voice_name or 'output'}.wav",
        background=BackgroundTask(_delete_output),
    )
