import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import JSZip from "jszip";
import { buildClipArgs, type ClipPlan, type CommandSettings } from "./commands";

export type ProgressUpdate = {
  progress: number;
  clipIndex: number;
  etaSeconds: number | null;
  message: string;
};

class FFmpegService {
  private ffmpeg: FFmpeg | null = null;
  private loaded = false;

  async load(onMessage?: (message: string) => void) {
    if (this.loaded && this.ffmpeg) return this.ffmpeg;
    const ffmpeg = new FFmpeg();
    ffmpeg.on("log", ({ message }) => onMessage?.(message));
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });
    this.ffmpeg = ffmpeg;
    this.loaded = true;
    return ffmpeg;
  }

  async processClips(input: File, clips: ClipPlan[], settings: CommandSettings, onProgress: (update: ProgressUpdate) => void, introFile?: File | null, outroFile?: File | null) {
    const ffmpeg = await this.load((message) => onProgress({ progress: 0, clipIndex: 0, etaSeconds: null, message }));
    const inputName = `input.${input.name.split(".").pop() || "mp4"}`;
    await ffmpeg.writeFile(inputName, await fetchFile(input));
    const introName = introFile ? "intro.mp4" : null;
    const outroName = outroFile ? "outro.mp4" : null;
    if (introFile && introName) await ffmpeg.writeFile(introName, await fetchFile(introFile));
    if (outroFile && outroName) await ffmpeg.writeFile(outroName, await fetchFile(outroFile));

    const startedAt = performance.now();
    const outputs: { name: string; blob: Blob; url: string; clip: ClipPlan }[] = [];

    for (const clip of clips) {
      onProgress({ progress: ((clip.index - 1) / clips.length) * 100, clipIndex: clip.index, etaSeconds: null, message: `Processing clip ${clip.index}` });
      const segmentName = introName || outroName ? `segment_${clip.outputName}` : clip.outputName;
      await ffmpeg.exec(buildClipArgs(inputName, { ...clip, outputName: segmentName }, settings));
      if (introName || outroName) {
        const concatListName = `concat_${clip.index}.txt`;
        const files = [introName, segmentName, outroName].filter(Boolean).map((name) => `file '${name}'`).join("\n");
        await ffmpeg.writeFile(concatListName, files);
        await ffmpeg.exec(["-f", "concat", "-safe", "0", "-i", concatListName, "-c", "copy", clip.outputName]);
        await ffmpeg.deleteFile(concatListName);
        await ffmpeg.deleteFile(segmentName);
      }
      const data = await ffmpeg.readFile(clip.outputName);
      const blob = new Blob([data], { type: "video/mp4" });
      outputs.push({ name: clip.outputName, blob, url: URL.createObjectURL(blob), clip });
      await ffmpeg.deleteFile(clip.outputName);

      const progress = (clip.index / clips.length) * 100;
      const elapsed = (performance.now() - startedAt) / 1000;
      const etaSeconds = progress > 0 ? (elapsed / progress) * (100 - progress) : null;
      onProgress({ progress, clipIndex: clip.index, etaSeconds, message: `Finished ${clip.outputName}` });
    }

    await ffmpeg.deleteFile(inputName);
    if (introName) await ffmpeg.deleteFile(introName);
    if (outroName) await ffmpeg.deleteFile(outroName);
    return outputs;
  }

  async createZip(files: { name: string; blob: Blob }[]) {
    const zip = new JSZip();
    files.forEach((file) => zip.file(file.name, file.blob));
    return zip.generateAsync({ type: "blob" });
  }
}

export const ffmpegService = new FFmpegService();
