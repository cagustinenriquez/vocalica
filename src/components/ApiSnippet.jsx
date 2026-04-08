import { Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ApiSnippet({ text, voiceName, copied, onCopy }) {
  const snippet = `POST /api/clone-voice\nContent-Type: multipart/form-data\n\nfile: <audio>\ntext: ${text || "<text>"}\nlanguage: es-AR\nvoice_name: ${voiceName || "<name>"}`;

  return (
    <Card className="rounded-3xl border-zinc-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Expected API</CardTitle>
        <CardDescription>This frontend is ready to connect to a real endpoint.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl bg-zinc-950 p-4 text-sm text-zinc-100">
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono leading-6">{snippet}</pre>
        </div>
        <Button variant="outline" className="w-full rounded-2xl" onClick={onCopy}>
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          {copied ? "Copied" : "Copy example"}
        </Button>
      </CardContent>
    </Card>
  );
}
