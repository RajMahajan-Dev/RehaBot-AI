import { useState } from "react";
import { RunMode } from "../RunMode";
import { ThemeProvider } from "../ThemeProvider";
import { Button } from "@/components/ui/button";

export default function RunModeExample() {
  const [isOpen, setIsOpen] = useState(true);
  
  const sampleBlock = {
    id: "1",
    type: "motivational" as const,
    title: "Daily Affirmations",
    durationMinutes: 10,
    difficulty: "easy" as const,
    progress: 0,
    steps: [
      { title: "Deep breathing", duration: 2, voiceCue: "Breathe in... and out..." },
      { title: "Positive affirmations", duration: 5, voiceCue: "You are strong and capable" },
      { title: "Gratitude reflection", duration: 3, voiceCue: "Think of three things you're grateful for" },
    ],
  };

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>Open Run Mode</Button>
        <RunMode
          isOpen={isOpen}
          block={sampleBlock}
          onClose={() => setIsOpen(false)}
          onComplete={(id) => {
            console.log("Completed:", id);
            setIsOpen(false);
          }}
        />
      </div>
    </ThemeProvider>
  );
}
