export function EditorMock() {
  return (
    <div className="relative mx-auto max-w-2xl rounded-3xl border border-white/10 bg-slate-950/90 p-4 shadow-2xl shadow-indigo-500/20">
      <div className="mb-4 flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-green-400" /></div>
      <div className="grid gap-4 md:grid-cols-[1fr_180px]">
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-3">
          <div className="aspect-video rounded-xl bg-gradient-to-br from-indigo-500/30 via-slate-800 to-green-500/20" />
          <div className="mt-4 space-y-2">
            {[0, 1, 2].map((track) => <div key={track} className="h-8 rounded-lg bg-slate-800"><div className="h-full rounded-lg bg-indigo-500/70" style={{ width: `${76 - track * 14}%` }} /></div>)}
          </div>
        </div>
        <div className="mx-auto aspect-[9/16] w-36 rounded-2xl border border-indigo-400/30 bg-slate-900 p-2">
          <div className="h-full rounded-xl bg-gradient-to-b from-indigo-500/50 to-green-500/30" />
        </div>
      </div>
    </div>
  );
}
