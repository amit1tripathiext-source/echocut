import { Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavbarProps = { onLaunch?: () => void };

export function Navbar({ onLaunch }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => window.location.assign("#home")} className="flex items-center gap-2 font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-glow"><Scissors className="h-5 w-5" /></span>
          EchoCut
        </button>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#trust" className="hover:text-foreground">Privacy</a>
        </nav>
        <Button onClick={onLaunch}>Start Editing</Button>
      </div>
    </header>
  );
}
