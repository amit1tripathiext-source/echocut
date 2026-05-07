import { ArrowRight, CheckCircle2, Lock, PlayCircle, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { EditorMock } from "@/components/video/EditorMock";

const features = [
  "✂️ Auto Split by Duration",
  "📱 Platform Presets (Reels, Shorts, Snapchat)",
  "🎬 Vertical Conversion (Scale or Blur Background)",
  "🔊 Silence Removal",
  "📦 Batch Export (ZIP or individual downloads)",
  "🎞️ Intro / Outro Support",
  "⚡ Original Quality Preservation",
  "📊 Progress + ETA Tracking",
];

export function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div id="home" className="min-h-screen overflow-hidden bg-background">
      <Navbar onLaunch={onLaunch} />
      <main>
        <section className="relative grid-fade px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.24),transparent_42%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm text-green-300"><ShieldCheck className="h-4 w-4" /> No Upload, Fully Private</div>
              <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">Cut Long Videos into Viral Shorts — Instantly</h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">No uploads. No waiting. Your videos stay on your device.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button size="lg" onClick={onLaunch}>Start Editing <ArrowRight className="ml-2 h-5 w-5" /></Button><Button size="lg" variant="outline" asChild><a href="#how"><PlayCircle className="mr-2 h-5 w-5" />See How It Works</a></Button></div>
            </div>
            <EditorMock />
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8">
          <Card className="border-red-400/20 bg-red-400/5"><CardHeader><CardTitle>Problem</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">Long videos don’t fit short-form platforms</CardContent></Card>
          <Card className="border-green-400/20 bg-green-400/5"><CardHeader><CardTitle>Solution</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">Auto-split + optimize in seconds</CardContent></Card>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl"><h2 className="text-3xl font-bold sm:text-4xl">Everything creators need to repurpose faster</h2><p className="mt-3 text-muted-foreground">A focused browser tool for turning webinars, podcasts, streams, and tutorials into platform-ready clips.</p></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map((feature) => <Card key={feature} className="bg-card/70"><CardContent className="p-5 font-semibold">{feature}</CardContent></Card>)}</div>
        </section>

        <section id="how" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold">How It Works</h2>
          <div className="grid gap-4 md:grid-cols-3">{["Upload your video", "Choose duration & settings", "Download ready-to-post clips"].map((step, index) => <Card key={step}><CardContent className="p-6"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-xl font-black">{index + 1}</div><h3 className="text-xl font-semibold">{step}</h3></CardContent></Card>)}</div>
        </section>

        <section id="trust" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-4 rounded-3xl border border-white/10 bg-slate-950 p-6 md:grid-cols-3">{[[Lock, "100% Local Processing"], [ShieldCheck, "No file uploads"], [Zap, "No data stored"]].map(([Icon, label]) => { const TrustIcon = Icon as typeof Lock; return <div key={label as string} className="flex items-center gap-3 text-lg font-semibold"><TrustIcon className="h-6 w-6 text-green-400" />{label as string}</div>; })}</div>
        </section>

        <section className="px-4 pb-28 pt-16 text-center sm:px-6 lg:px-8 md:pb-16"><h2 className="text-3xl font-black sm:text-5xl">Start Creating Short-Form Content in Seconds</h2><Button className="mt-8" size="lg" onClick={onLaunch}>Launch Editor</Button></section>
      </main>
      <div className="fixed inset-x-3 bottom-3 z-50 md:hidden"><Button className="w-full shadow-glow" size="lg" onClick={onLaunch}>Start Editing</Button></div>
    </div>
  );
}
