import { Trash2 } from "lucide-react";
import { useVideoStore } from "@/store/useVideoStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ClipPreviewListProps = { plannedCount: number };

export function ClipPreviewList({ plannedCount }: ClipPreviewListProps) {
  const { generatedClips, removeGeneratedClip } = useVideoStore();
  const visible = generatedClips.filter((clip) => !clip.deleted);
  return (
    <Card>
      <CardHeader><CardTitle>Clip Preview List</CardTitle></CardHeader>
      <CardContent>
        {visible.length === 0 ? <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-muted-foreground">Generate clips to preview thumbnails, durations, playback, and delete controls. Current plan: {plannedCount} clips.</div> : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map(({ name, url, clip }) => (
              <article key={name} className="rounded-2xl border border-white/10 bg-slate-950 p-3">
                {url ? <video src={url} className="aspect-video w-full rounded-xl bg-black" controls /> : <div className="aspect-video rounded-xl bg-muted" />}
                <div className="mt-3 flex items-center justify-between gap-3"><div><strong>{name}</strong><p className="text-sm text-muted-foreground">{clip.duration.toFixed(1)}s · starts {clip.start.toFixed(1)}s</p></div><Button size="icon" variant="ghost" onClick={() => removeGeneratedClip(name)}><Trash2 className="h-4 w-4" /></Button></div>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
