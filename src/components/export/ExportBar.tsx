import { Download, Package } from "lucide-react";
import { ffmpegService } from "@/features/ffmpeg/ffmpegService";
import { useVideoStore } from "@/store/useVideoStore";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type ExportBarProps = { disabled?: boolean; isProcessing: boolean; progress: number; eta: number | null; currentClip: number; onProcess: () => void };

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ExportBar({ disabled, isProcessing, progress, eta, currentClip, onProcess }: ExportBarProps) {
  const clips = useVideoStore((state) => state.generatedClips.filter((clip) => !clip.deleted && clip.blob));
  return (
    <section className="sticky bottom-0 z-30 rounded-t-3xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl md:rounded-3xl">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="space-y-2"><div className="flex justify-between text-sm"><span>{isProcessing ? `Current clip: ${currentClip}` : "Ready to process locally"}</span><span>{Math.round(progress)}% {eta ? `· ETA ${Math.ceil(eta)}s` : ""}</span></div><Progress value={progress} /></div>
        <div className="flex flex-wrap gap-2">
          <Button disabled={disabled || isProcessing} onClick={onProcess}>{isProcessing ? "Processing…" : "Generate Clips"}</Button>
          <Button variant="outline" disabled={!clips.length || isProcessing} onClick={() => clips.forEach((clip) => clip.blob && downloadBlob(clip.blob, clip.name))}><Download className="mr-2 h-4 w-4" />Download individually</Button>
          <Button variant="secondary" disabled={!clips.length || isProcessing} onClick={async () => downloadBlob(await ffmpegService.createZip(clips.map((clip) => ({ name: clip.name, blob: clip.blob! }))), "echocut_clips.zip")}><Package className="mr-2 h-4 w-4" />Download ZIP</Button>
        </div>
      </div>
    </section>
  );
}
