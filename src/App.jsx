import { useMemo, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import AudioUploader from "@/components/AudioUploader";
import TextForm from "@/components/TextForm";
import ResultPanel from "@/components/ResultPanel";
import ApiSnippet from "@/components/ApiSnippet";

export default function VozClonARWebsite() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [text, setText] = useState("Hello, how are you? This is a demo of voice cloning adapted for Argentinian Spanish.");
  const [voiceName, setVoiceName] = useState("My cloned voice");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [isPlayingInput, setIsPlayingInput] = useState(false);
  const [isPlayingOutput, setIsPlayingOutput] = useState(false);
  const [consentChecked, setConsentChecked] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const inputAudioRef = useRef(null);
  const outputAudioRef = useRef(null);

  const estimatedSeconds = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return Math.max(2, Math.ceil(words / 2.4));
  }, [text]);

  const handleAudioUpload = (file) => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setError("");
    setAudioFile(file);
    setAudioUrl(URL.createObjectURL(file));
    setGeneratedUrl("");
    setProgress(0);
  };

  const toggleAudio = (ref, isPlaying, setter) => {
    const el = ref.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setter(false);
    } else {
      el.play();
      setter(true);
    }
  };

  const handleGenerate = async () => {
    if (!audioFile || !text.trim() || !consentChecked) return;

    setIsGenerating(true);
    setProgress(8);
    setGeneratedUrl("");

    const steps = [18, 29, 46, 58, 71, 84, 96];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i += 1;
      }
    }, 450);

    try {
      setError("");
      const formData = new FormData();
      formData.append("file", audioFile);
      formData.append("text", text);
      formData.append("language", "es-AR");
      formData.append("voice_name", voiceName);

      let res;
      try {
        res = await fetch("/api/clone-voice", { method: "POST", body: formData });
      } catch {
        throw new Error("Could not reach the server. Make sure the backend is running.");
      }

      if (!res.ok) {
        let detail = `Server error ${res.status}`;
        try {
          const json = await res.json();
          if (json.detail) detail = json.detail;
        } catch {}
        throw new Error(detail);
      }

      const blob = await res.blob();
      setGeneratedUrl(URL.createObjectURL(blob));
      setProgress(100);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setProgress(0);
    } finally {
      clearInterval(interval);
      setTimeout(() => setIsGenerating(false), 250);
    }
  };

  const copySnippet = async () => {
    const snippet = `POST /api/clone-voice\nContent-Type: multipart/form-data\n\nfile: <audio>\ntext: ${text || "<text>"}\nlanguage: es-AR\nvoice_name: ${voiceName || "<name>"}`;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge className="rounded-full">es-AR</Badge>
                <Badge variant="secondary" className="rounded-full">Voice cloning</Badge>
                <Badge variant="outline" className="rounded-full">Demo UI</Badge>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                Clone a voice and make it speak in <span className="italic">Argentinian Spanish</span>
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600 md:text-base">
                Upload a voice sample, write your text, and generate speech using that same vocal identity.
                This interface is tailored for Argentina and ready to connect to a TTS backend.
              </p>
            </div>

            <Card className="w-full max-w-sm rounded-2xl border-zinc-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5" />
                  <div>
                    <p className="font-medium">Responsible use</p>
                    <p className="mt-1 text-sm text-zinc-600">
                      Only upload voices that are yours or that you have explicit permission to use.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <AudioUploader
              audioFile={audioFile}
              audioUrl={audioUrl}
              isPlayingInput={isPlayingInput}
              inputAudioRef={inputAudioRef}
              onUpload={handleAudioUpload}
              onTogglePlay={() => toggleAudio(inputAudioRef, isPlayingInput, setIsPlayingInput)}
              onAudioEnded={() => setIsPlayingInput(false)}
            />
            <TextForm
              text={text}
              voiceName={voiceName}
              consentChecked={consentChecked}
              isGenerating={isGenerating}
              progress={progress}
              error={error}
              estimatedSeconds={estimatedSeconds}
              audioFile={audioFile}
              onTextChange={setText}
              onVoiceNameChange={setVoiceName}
              onConsentChange={setConsentChecked}
              onGenerate={handleGenerate}
            />
          </div>

          <div className="space-y-6">
            <ResultPanel
              generatedUrl={generatedUrl}
              voiceName={voiceName}
              isPlayingOutput={isPlayingOutput}
              outputAudioRef={outputAudioRef}
              onTogglePlay={() => toggleAudio(outputAudioRef, isPlayingOutput, setIsPlayingOutput)}
              onAudioEnded={() => setIsPlayingOutput(false)}
            />
            <ApiSnippet
              text={text}
              voiceName={voiceName}
              copied={copied}
              onCopy={copySnippet}
            />

            <Card className="rounded-3xl border-zinc-200 shadow-sm">
              <CardContent className="space-y-3 p-5 text-sm text-zinc-600">
                <p className="font-medium text-zinc-900">Suggested stack</p>
                <div className="rounded-2xl border p-3">
                  <p className="font-medium text-zinc-900">Frontend</p>
                  <p>React + Tailwind + multipart POST endpoint.</p>
                </div>
                <div className="rounded-2xl border p-3">
                  <p className="font-medium text-zinc-900">Backend</p>
                  <p>FastAPI or Node to receive audio + text and return WAV/MP3.</p>
                </div>
                <div className="rounded-2xl border p-3">
                  <p className="font-medium text-zinc-900">Model</p>
                  <p>TTS engine with voice cloning support and strong Spanish performance.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-3xl border-zinc-200 shadow-sm">
            <CardContent className="p-5">
              <p className="font-medium">Built for demos and MVPs</p>
              <p className="mt-1 text-sm text-zinc-600">Upload, preview, progress feedback, and download flow included.</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-zinc-200 shadow-sm">
            <CardContent className="p-5">
              <p className="font-medium">Argentina-ready</p>
              <p className="mt-1 text-sm text-zinc-600">Prepared for Argentinian Spanish and local product positioning.</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-zinc-200 shadow-sm">
            <CardContent className="p-5">
              <p className="font-medium">Easy to integrate</p>
              <p className="mt-1 text-sm text-zinc-600">Only the real backend call still needs to be wired in.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
