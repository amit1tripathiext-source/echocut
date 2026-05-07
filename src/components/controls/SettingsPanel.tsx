import { platformPresets } from "@/features/ffmpeg/commands";
import { formatBytes } from "@/hooks/useProcessing";
import { useVideoStore } from "@/store/useVideoStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type SettingsPanelProps = { disabled?: boolean; clipCount: number; estimatedSize: number };

export function SettingsPanel({ disabled, clipCount, estimatedSize }: SettingsPanelProps) {
  const store = useVideoStore();
  return (
    <Card>
      <CardHeader><CardTitle>Settings Panel</CardTitle></CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label>Platform preset</Label>
          <Select disabled={disabled} value={store.preset} onChange={(e) => {
            const preset = e.target.value as keyof typeof platformPresets | "custom";
            store.setSettings({ preset, clipDuration: preset === "custom" ? store.clipDuration : platformPresets[preset].duration, verticalMode: preset === "custom" ? store.verticalMode : "blur" });
          }}>
            <option value="custom">Custom</option>
            {Object.entries(platformPresets).map(([key, preset]) => <option key={key} value={key}>{preset.label} · {preset.aspectRatio}</option>)}
          </Select>
        </div>
        <div className="space-y-2"><Label>Duration (seconds)</Label><Input disabled={disabled} type="number" min={1} value={store.clipDuration} onChange={(e) => store.setSettings({ clipDuration: Number(e.target.value), preset: "custom" })} /></div>
        <div className="space-y-2"><Label>Vertical conversion preview</Label><Select disabled={disabled} value={store.verticalMode} onChange={(e) => store.setSettings({ verticalMode: e.target.value as typeof store.verticalMode })}><option value="off">Off</option><option value="scale">Scale (9:16)</option><option value="blur">Blur Background (recommended)</option></Select></div>
        <div className="space-y-2"><Label>Processing mode</Label><Select disabled={disabled} value={store.processingMode} onChange={(e) => store.setSettings({ processingMode: e.target.value as typeof store.processingMode })}><option value="fast">Fast Mode (-c copy)</option><option value="quality">High Quality (x264 CRF 23)</option></Select></div>
        <label className="flex items-center gap-3 rounded-xl border border-white/10 p-3"><input disabled={disabled} type="checkbox" checked={store.removeSilence} onChange={(e) => store.setSettings({ removeSilence: e.target.checked })} /> <span>Remove silence</span></label>
        <div className="rounded-xl border border-white/10 p-3 text-sm text-muted-foreground"><strong className="text-foreground">Estimator:</strong> {clipCount} clips · ~{formatBytes(estimatedSize)}</div>
        <div className="space-y-2"><Label>Intro video</Label><Input disabled={disabled} type="file" accept="video/*" onChange={(e) => store.setSettings({ introFile: e.target.files?.[0] || null })} /></div>
        <div className="space-y-2"><Label>Outro video</Label><Input disabled={disabled} type="file" accept="video/*" onChange={(e) => store.setSettings({ outroFile: e.target.files?.[0] || null })} /></div>
      </CardContent>
    </Card>
  );
}
