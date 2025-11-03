import { RoutineCard } from "../RoutineCard";
import { ThemeProvider } from "../ThemeProvider";

export default function RoutineCardExample() {
  const sampleBlock = {
    id: "1",
    type: "exercise" as const,
    title: "Morning Stretch & Balance",
    durationMinutes: 20,
    difficulty: "medium" as const,
    progress: 65,
    steps: [
      { title: "Warm-up stretches", duration: 5, voiceCue: "Breathe deeply and relax" },
      { title: "Balance exercises", duration: 8, voiceCue: "Focus on your core" },
      { title: "Cool down", duration: 7, voiceCue: "Great job today" },
    ],
  };

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="p-8 max-w-md">
        <RoutineCard
          block={sampleBlock}
          onEdit={(block) => console.log("Edit:", block)}
          onDelete={(id) => console.log("Delete:", id)}
        />
      </div>
    </ThemeProvider>
  );
}
