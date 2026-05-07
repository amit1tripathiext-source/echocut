import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoPreview } from "@/components/video/VideoPreview";
import { SettingsPanel } from "@/components/controls/SettingsPanel";
import { ClipPreviewList } from "@/components/video/ClipPreviewList";
import { ExportBar } from "@/components/export/ExportBar";
import { useFFmpeg } from "@/hooks/useFFmpeg";
import { useProcessing } from "@/hooks/useProcessing";

export function EditorPage({ onBack }: { onBack: () => void }) {
  const ffmpeg = useFFmpeg();
  const processing = useProcessing();
  const disabled = processing.isProcessing || ffmpeg.isLoading;

  async function handleProcess() {
    await ffmpeg.load();
    await processing.process();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/10 bg-slate-950/90 p-4 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between"><Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />Landing</Button><strong>EchoCut Editor</strong><span className="hidden text-sm text-green-400 md:block">Processing happens locally — your files are never uploaded</span></div></header>
      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-5 pb-32">
        {ffmpeg.isLoading && <div className="rounded-2xl border border-indigo-400/30 bg-indigo-400/10 p-4 text-indigo-100"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />Loading FFmpeg for the first time. This is lazy-loaded only when needed.</div>}
        {processing.error && <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-red-100">{processing.error}</div>}
        <VideoPreview disabled={disabled} />
        <SettingsPanel disabled={disabled} clipCount={processing.plannedClips.length} estimatedSize={processing.estimatedSize} />
        <ClipPreviewList plannedCount={processing.plannedClips.length} />
      </main>
      <ExportBar disabled={disabled} isProcessing={processing.isProcessing} progress={processing.progress.progress} eta={processing.progress.etaSeconds} currentClip={processing.progress.clipIndex} onProcess={handleProcess} />
    </div>
  );
}
