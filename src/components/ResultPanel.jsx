import { Play, Pause, Download, AudioLines } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ResultPanel({ generatedUrl, voiceName, isPlayingOutput, outputAudioRef, onTogglePlay, onAudioEnded }) {
  return (
    <Card className="rounded-3xl border-zinc-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Result</CardTitle>
        <CardDescription>Your generated audio will appear here.</CardDescription>
      </CardHeader>
      <CardContent>
        {!generatedUrl ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
            <AudioLines className="mb-3 h-10 w-10 text-zinc-400" />
            <p className="font-medium">No generated audio yet</p>
            <p className="mt-1 text-sm text-zinc-500">Upload a sample and click "Generate voice".</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="rounded-2xl border bg-zinc-50 p-4">
              <p className="font-medium">{voiceName || "Generated voice"}</p>
              <p className="mt-1 text-sm text-zinc-500">Language: Spanish (Argentina)</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="rounded-2xl" onClick={onTogglePlay}>
                {isPlayingOutput ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlayingOutput ? "Pause" : "Play"}
              </Button>
              <Button asChild className="rounded-2xl">
                <a href={generatedUrl} download="generated-voice.wav">
                  <Download className="mr-2 h-4 w-4" /> Download
                </a>
              </Button>
            </div>
            <audio ref={outputAudioRef} src={generatedUrl} onEnded={onAudioEnded} />
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
