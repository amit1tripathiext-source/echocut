export type PlatformPreset = "custom" | "reels" | "shorts" | "snapchat";
export type VerticalMode = "off" | "scale" | "blur";
export type ProcessingMode = "fast" | "quality";

export type ClipPlan = {
  index: number;
  start: number;
  duration: number;
  outputName: string;
};

export type CommandSettings = {
  durationSeconds: number;
  videoDurationSeconds: number;
  verticalMode: VerticalMode;
  removeSilence: boolean;
  processingMode: ProcessingMode;
  hasIntro: boolean;
  hasOutro: boolean;
};

export const platformPresets: Record<Exclude<PlatformPreset, "custom">, { label: string; duration: number; aspectRatio: "9:16" }> = {
  reels: { label: "Reels (≤90s)", duration: 90, aspectRatio: "9:16" },
  shorts: { label: "Shorts (≤60s)", duration: 60, aspectRatio: "9:16" },
  snapchat: { label: "Snapchat", duration: 10, aspectRatio: "9:16" },
};

export function createClipPlan(videoDurationSeconds: number, durationSeconds: number): ClipPlan[] {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    throw new Error("Choose a clip duration greater than 0 seconds.");
  }
  if (!Number.isFinite(videoDurationSeconds) || videoDurationSeconds <= 0) {
    throw new Error("Load a supported video before generating clips.");
  }
  if (durationSeconds > videoDurationSeconds) {
    throw new Error("Clip duration cannot be longer than the source video.");
  }

  const overlapSeconds = 1;
  const step = Math.max(1, durationSeconds - overlapSeconds);
  const plans: ClipPlan[] = [];
  let start = 0;

  while (start < videoDurationSeconds) {
    const remaining = videoDurationSeconds - start;
    plans.push({
      index: plans.length + 1,
      start,
      duration: Math.min(durationSeconds, remaining),
      outputName: `video_clip_${String(plans.length + 1).padStart(2, "0")}.mp4`,
    });
    if (start + durationSeconds >= videoDurationSeconds) break;
    start += step;
  }

  return plans;
}

export function getVideoFilter(mode: VerticalMode) {
  if (mode === "scale") return "scale=1080:1920";
  if (mode === "blur") return "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,boxblur=10:1";
  return undefined;
}

export function estimateExportSizeBytes(fileSizeBytes: number, videoDurationSeconds: number, clips: ClipPlan[]) {
  if (!fileSizeBytes || !videoDurationSeconds || clips.length === 0) return 0;
  const sizePerSecond = fileSizeBytes / videoDurationSeconds;
  const totalClipSeconds = clips.reduce((sum, clip) => sum + clip.duration, 0);
  return sizePerSecond * totalClipSeconds;
}

export function buildClipArgs(inputName: string, clip: ClipPlan, settings: CommandSettings) {
  const args = ["-ss", String(clip.start), "-t", String(clip.duration), "-i", inputName];
  const videoFilter = getVideoFilter(settings.verticalMode);
  const needsEncoding = settings.processingMode === "quality" || Boolean(videoFilter) || settings.removeSilence || settings.hasIntro || settings.hasOutro;

  if (videoFilter) args.push("-vf", videoFilter);
  if (settings.removeSilence) args.push("-af", "silenceremove=stop_periods=-1:stop_duration=0.5:stop_threshold=-40dB");

  if (needsEncoding) {
    args.push("-c:v", "libx264", "-preset", "fast", "-crf", "23", "-c:a", "aac");
  } else {
    args.push("-c", "copy");
  }

  args.push(clip.outputName);
  return args;
}
