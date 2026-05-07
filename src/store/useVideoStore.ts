import { create } from "zustand";
import type { ClipPlan, PlatformPreset, ProcessingMode, VerticalMode } from "@/features/ffmpeg/commands";

type GeneratedClip = {
  name: string;
  blob?: Blob;
  url?: string;
  clip: ClipPlan;
  deleted?: boolean;
};

type VideoState = {
  sourceFile: File | null;
  sourceUrl: string | null;
  videoDuration: number;
  preset: PlatformPreset;
  clipDuration: number;
  verticalMode: VerticalMode;
  removeSilence: boolean;
  processingMode: ProcessingMode;
  introFile: File | null;
  outroFile: File | null;
  plannedClips: ClipPlan[];
  generatedClips: GeneratedClip[];
  setSource: (file: File | null, url: string | null, duration: number) => void;
  setSettings: (settings: Partial<Omit<VideoState, "setSource" | "setSettings" | "setGeneratedClips" | "removeGeneratedClip">>) => void;
  setGeneratedClips: (clips: GeneratedClip[]) => void;
  removeGeneratedClip: (name: string) => void;
};

export const useVideoStore = create<VideoState>((set) => ({
  sourceFile: null,
  sourceUrl: null,
  videoDuration: 0,
  preset: "shorts",
  clipDuration: 60,
  verticalMode: "blur",
  removeSilence: false,
  processingMode: "fast",
  introFile: null,
  outroFile: null,
  plannedClips: [],
  generatedClips: [],
  setSource: (sourceFile, sourceUrl, videoDuration) => set({ sourceFile, sourceUrl, videoDuration, generatedClips: [], plannedClips: [] }),
  setSettings: (settings) => set(settings),
  setGeneratedClips: (generatedClips) => set({ generatedClips }),
  removeGeneratedClip: (name) => set((state) => ({ generatedClips: state.generatedClips.map((clip) => (clip.name === name ? { ...clip, deleted: true } : clip)) })),
}));
