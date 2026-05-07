import { useState } from "react";
import { ffmpegService } from "@/features/ffmpeg/ffmpegService";

export function useFFmpeg() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [log, setLog] = useState("");

  async function load() {
    if (isLoaded) return;
    setIsLoading(true);
    try {
      await ffmpegService.load(setLog);
      setIsLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, isLoaded, log, load };
}
