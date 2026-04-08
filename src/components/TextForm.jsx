import { Mic, Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

export default function TextForm({
  text, voiceName, consentChecked, isGenerating, progress, error,
  estimatedSeconds, audioFile,
  onTextChange, onVoiceNameChange, onConsentChange, onGenerate,
}) {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <Card className="rounded-3xl border-zinc-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">2. Text to synthesize</CardTitle>
        <CardDescription>Type exactly what you want the cloned voice to say.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="voiceName">Voice name</Label>
            <Input
              id="voiceName"
              value={voiceName}
              onChange={(e) => onVoiceNameChange(e.target.value)}
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
            onChange={(e) => onTextChange(e.target.value)}
            className="min-h-[180px] rounded-2xl"
            placeholder="Write your text here..."
          />
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-500">
            <span>{wordCount} words</span>
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
            <Switch checked={consentChecked} onCheckedChange={onConsentChange} />
          </div>
        </div>

        <Button
          onClick={onGenerate}
          disabled={!audioFile || !text.trim() || !consentChecked || isGenerating}
          className="h-12 rounded-2xl px-6 text-base"
        >
          {isGenerating ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating audio...</>
          ) : (
            <><Mic className="mr-2 h-4 w-4" /> Generate voice</>
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
  );
}
