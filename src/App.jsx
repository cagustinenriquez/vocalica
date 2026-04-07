import React, { useMemo, useRef, useState } from "react";
import { Upload, Mic, Play, Pause, Download, Loader2, ShieldCheck, AudioLines, Copy, Check, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

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

  const apiSnippet = `POST /api/clone-voice\nContent-Type: multipart/form-data\n\nfile: <audio>\ntext: ${text || "<text>"}\nlanguage: es-AR\nvoice_name: ${voiceName || "<name>"}`;

  const ALLOWED_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/x-m4a", "audio/webm"];

  const handleAudioUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a|webm)$/i)) {
      setError("Unsupported file type. Please upload an .mp3, .wav, .ogg, or .m4a file.");
      return;
    }

    if (audioUrl) URL.revokeObjectURL(audioUrl);

    setError("");
    const url = URL.createObjectURL(file);
    setAudioFile(file);
    setAudioUrl(url);
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

  const handleAudioEnded = (setter) => setter(false);

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
      const url = URL.createObjectURL(blob);
      setGeneratedUrl(url);
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
    try {
      await navigator.clipboard.writeText(apiSnippet);
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
            <Card className="rounded-3xl border-zinc-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">1. Voice sample</CardTitle>
                <CardDescription>
                  Best results: clean speech, no background music, 10 to 45 seconds.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <label className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center transition hover:border-zinc-400 hover:bg-zinc-100">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-white">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-base font-medium">Upload a .mp3, .wav, .ogg, or .m4a file</p>
                  <p className="mt-1 text-sm text-zinc-500">Drag your audio here or click to browse</p>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleAudioUpload}
                  />
                </label>

                {audioFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{audioFile.name}</p>
                        <p className="text-sm text-zinc-500">
                          {Math.round(audioFile.size / 1024)} KB · ready to use
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="rounded-2xl"
                        onClick={() => toggleAudio(inputAudioRef, isPlayingInput, setIsPlayingInput)}
                      >
                        {isPlayingInput ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                        {isPlayingInput ? "Pause sample" : "Play sample"}
                      </Button>
                    </div>
                    <audio
                      ref={inputAudioRef}
                      src={audioUrl}
                      onEnded={() => handleAudioEnded(setIsPlayingInput)}
                    />
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-zinc-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">2. Text to synthesize</CardTitle>
                <CardDescription>
                  Type exactly what you want the cloned voice to say.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="voiceName">Voice name</Label>
                    <Input
                      id="voiceName"
                      value={voiceName}
                      onChange={(e) => setVoiceName(e.target.value)}
                      className="rounded-2xl"
                      placeholder="Example: Buenos Aires narrator"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Language and accent</Label>
                    <div className="flex h-10 items-center rounded-2xl border bg-zinc-50 px-3 text-sm text-zinc-700">
                      Spanish (Argentina) · es-AR
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text">Text</Label>
                  <Textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[180px] rounded-2xl"
                    placeholder="Write your text here..."
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-500">
                    <span>{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
                    <span>Estimated duration: ~{estimatedSeconds}s</span>
                  </div>
                </div>

                <div className="rounded-2xl border bg-zinc-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">Voice consent</p>
                      <p className="mt-1 text-sm text-zinc-600">
                        I confirm I have the right to use this voice or explicit permission to do so.
                      </p>
                    </div>
                    <Switch checked={consentChecked} onCheckedChange={setConsentChecked} />
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!audioFile || !text.trim() || !consentChecked || isGenerating}
                  className="h-12 rounded-2xl px-6 text-base"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating audio...
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" /> Generate voice
                    </>
                  )}
                </Button>

                {error && (
                  <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {(isGenerating || progress > 0) && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-zinc-600">
                      <span>Processing sample and synthesizing</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-zinc-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Result</CardTitle>
                <CardDescription>
                  Your generated audio will appear here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!generatedUrl ? (
                  <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
                    <AudioLines className="mb-3 h-10 w-10 text-zinc-400" />
                    <p className="font-medium">No generated audio yet</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      Upload a sample and click “Generate voice”.
                    </p>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="rounded-2xl border bg-zinc-50 p-4">
                      <p className="font-medium">{voiceName || "Generated voice"}</p>
                      <p className="mt-1 text-sm text-zinc-500">Language: Spanish (Argentina)</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="rounded-2xl"
                        onClick={() => toggleAudio(outputAudioRef, isPlayingOutput, setIsPlayingOutput)}
                      >
                        {isPlayingOutput ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                        {isPlayingOutput ? "Pause" : "Play"}
                      </Button>
                      <Button asChild className="rounded-2xl">
                        <a href={generatedUrl} download="generated-voice-demo.wav">
                          <Download className="mr-2 h-4 w-4" /> Download
                        </a>
                      </Button>
                    </div>

                    <audio
                      ref={outputAudioRef}
                      src={generatedUrl}
                      onEnded={() => handleAudioEnded(setIsPlayingOutput)}
                    />
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-zinc-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Expected API</CardTitle>
                <CardDescription>
                  This frontend is ready to connect to a real endpoint.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-zinc-950 p-4 text-sm text-zinc-100">
                  <pre className="overflow-x-auto whitespace-pre-wrap font-mono leading-6">{apiSnippet}</pre>
                </div>
                <Button variant="outline" className="w-full rounded-2xl" onClick={copySnippet}>
                  {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? "Copied" : "Copy example"}
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-zinc-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Suggested stack</CardTitle>
                <CardDescription>
                  A simple path to make it work for real.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-zinc-600">
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
