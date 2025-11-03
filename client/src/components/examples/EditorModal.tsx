import { useState } from "react";
import { EditorModal } from "../EditorModal";
import { ThemeProvider } from "../ThemeProvider";
import { Button } from "@/components/ui/button";

export default function EditorModalExample() {
  const [isOpen, setIsOpen] = useState(true);
  
  const sampleBlock = {
    id: "1",
    type: "cognitive" as const,
    title: "Memory Training",
    durationMinutes: 15,
    difficulty: "easy" as const,
    progress: 0,
    steps: [
      { title: "Memory game", duration: 10, voiceCue: "Focus on the patterns" },
      { title: "Reflection", duration: 5 },
    ],
  };

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>Open Editor</Button>
        <EditorModal
          isOpen={isOpen}
          block={sampleBlock}
          onClose={() => setIsOpen(false)}
          onSave={(block) => {
            console.log("Saved:", block);
            setIsOpen(false);
          }}
        />
      </div>
    </ThemeProvider>
  );
}
