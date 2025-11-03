import { Heart } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/40 backdrop-blur-lg bg-background/80">
      <div className="container mx-auto h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground" data-testid="text-app-title">
            RehaBot: AI for Recovery
          </h1>
        </div>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
