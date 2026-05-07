import { useRef } from "react";
import { UploadCloud } from "lucide-react";
import { useVideoStore } from "@/store/useVideoStore";

export function VideoPreview({ disabled }: { disabled?: boolean }) {
  const { sourceUrl, setSource } = useVideoStore();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("video/")) return alert("Unsupported format. Please choose a browser-playable video file.");
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => setSource(file, url, video.duration);
    video.onerror = () => alert("Unsupported video format. Try MP4/H.264 for best browser compatibility.");
    video.src = url;
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-card p-4">
      <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Video Preview</h2><span className="text-xs text-green-400">Processing happens locally — your files are never uploaded</span></div>
      {sourceUrl ? <video className="aspect-video w-full rounded-2xl bg-black" src={sourceUrl} controls /> : (
        <button disabled={disabled} onClick={() => inputRef.current?.click()} className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-400/50 bg-slate-950 text-center disabled:opacity-50">
          <UploadCloud className="mb-3 h-10 w-10 text-indigo-300" />
          <strong>Upload your long-form video</strong>
          <span className="mt-1 text-sm text-muted-foreground">Recommended limit: 300–500MB</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="video/*" className="hidden" disabled={disabled} onChange={(event) => handleFile(event.target.files?.[0])} />
    </section>
  );
}
