import { useState } from "react";
import { Upload, Play, Pause, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ALLOWED_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/x-m4a", "audio/webm"];

export default function AudioUploader({ audioFile, audioUrl, isPlayingInput, inputAudioRef, onUpload, onTogglePlay, onAudioEnded }) {
  const [uploadError, setUploadError] = useState("");

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a|webm)$/i)) {
      setUploadError("Unsupported file type. Please upload an .mp3, .wav, .ogg, or .m4a file.");
      return;
    }

    setUploadError("");
    onUpload(file);
  };

  return (
    <Card className="rounded-3xl border-zinc-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">1. Voice sample</CardTitle>
        <CardDescription>Best results: clean speech, no background music, 10 to 45 seconds.</CardDescription>
      </CardHeader>
      <CardContent>
        <label className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center transition hover:border-zinc-400 hover:bg-zinc-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-white">
            <Upload className="h-6 w-6" />
          </div>
          <p className="mt-4 text-base font-medium">Upload a .mp3, .wav, .ogg, or .m4a file</p>
          <p className="mt-1 text-sm text-zinc-500">Drag your audio here or click to browse</p>
          <input type="file" accept="audio/*" className="hidden" onChange={handleChange} />
        </label>

        {uploadError && (
          <div className="mt-3 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {audioFile && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="truncate font-medium">{audioFile.name}</p>
                <p className="text-sm text-zinc-500">{Math.round(audioFile.size / 1024)} KB · ready to use</p>
              </div>
              <Button variant="outline" className="rounded-2xl" onClick={onTogglePlay}>
                {isPlayingInput ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlayingInput ? "Pause sample" : "Play sample"}
              </Button>
            </div>
            <audio ref={inputAudioRef} src={audioUrl} onEnded={onAudioEnded} />
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
