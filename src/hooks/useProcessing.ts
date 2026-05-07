import { useMemo, useState } from "react";
import { createClipPlan, estimateExportSizeBytes } from "@/features/ffmpeg/commands";
import { ffmpegService, type ProgressUpdate } from "@/features/ffmpeg/ffmpegService";
import { useVideoStore } from "@/store/useVideoStore";

export function formatBytes(bytes: number) {
  if (!bytes) return "0 MB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function useProcessing() {
  const store = useVideoStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProgressUpdate>({ progress: 0, clipIndex: 0, etaSeconds: null, message: "Idle" });
  const [error, setError] = useState<string | null>(null);

  const plannedClips = useMemo(() => {
    try {
      return createClipPlan(store.videoDuration, store.clipDuration);
    } catch {
      return [];
    }
  }, [store.videoDuration, store.clipDuration]);

  const estimatedSize = useMemo(
    () => estimateExportSizeBytes(store.sourceFile?.size || 0, store.videoDuration, plannedClips),
    [store.sourceFile?.size, store.videoDuration, plannedClips],
  );

  async function process() {
    if (!store.sourceFile) return setError("Upload a video first.");
    if (store.sourceFile.size > 500 * 1024 * 1024) return setError("For browser stability, use a file under 500MB.");
    let clips = plannedClips;
    try {
      clips = createClipPlan(store.videoDuration, store.clipDuration);
    } catch (err) {
      return setError(err instanceof Error ? err.message : "Invalid clip settings.");
    }

    setError(null);
    setIsProcessing(true);
    try {
      const outputs = await ffmpegService.processClips(
        store.sourceFile,
        clips,
        {
          durationSeconds: store.clipDuration,
          videoDurationSeconds: store.videoDuration,
          verticalMode: store.verticalMode,
          removeSilence: store.removeSilence,
          processingMode: store.processingMode,
          hasIntro: Boolean(store.introFile),
          hasOutro: Boolean(store.outroFile),
        },
        setProgress,
        store.introFile,
        store.outroFile,
      );
      store.setGeneratedClips(outputs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed. Try a smaller or different video format.");
    } finally {
      setIsProcessing(false);
    }
  }

  return { plannedClips, estimatedSize, progress, error, isProcessing, process };
}
