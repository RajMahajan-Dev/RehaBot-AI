import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Upload, Share2, Sparkles, Play } from "lucide-react";
import { Header } from "@/components/Header";
import { OnboardingModal } from "@/components/OnboardingModal";
import { RoutineCard } from "@/components/RoutineCard";
import { EditorModal } from "@/components/EditorModal";
import { RunMode } from "@/components/RunMode";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type RoutineBlock = {
  id: string;
  type: "motivational" | "exercise" | "cognitive";
  title: string;
  durationMinutes: number;
  difficulty: "easy" | "medium" | "hard";
  progress: number;
  steps: Array<{
    title: string;
    duration: number;
    voiceCue?: string;
  }>;
};

type OnboardingData = {
  injuryType: string;
  mobilityLevel: string;
  dailyTime: string;
  intensity: string;
  goals: string;
};

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [routineBlocks, setRoutineBlocks] = useState<RoutineBlock[]>([]);
  const [editingBlock, setEditingBlock] = useState<RoutineBlock | null>(null);
  const [runningBlock, setRunningBlock] = useState<RoutineBlock | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("rehabot-routines");
    if (saved) {
      setRoutineBlocks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (routineBlocks.length > 0) {
      localStorage.setItem("rehabot-routines", JSON.stringify(routineBlocks));
    }
  }, [routineBlocks]);

  const handleOnboardingComplete = async (data: OnboardingData) => {
    setIsGenerating(true);
    
    toast({
      title: "Generating your routine...",
      description: "AI is creating a personalized plan for you.",
    });

    setTimeout(() => {
      const mockRoutines: RoutineBlock[] = [
        {
          id: crypto.randomUUID(),
          type: "motivational",
          title: "Morning Mindfulness",
          durationMinutes: 10,
          difficulty: "easy",
          progress: 0,
          steps: [
            { title: "Deep breathing exercise", duration: 3, voiceCue: "Breathe in slowly... hold... breathe out" },
            { title: "Positive affirmations", duration: 5, voiceCue: "You are capable and strong" },
            { title: "Set daily intentions", duration: 2, voiceCue: "Visualize your success today" },
          ],
        },
        {
          id: crypto.randomUUID(),
          type: "exercise",
          title: "Gentle Rehabilitation Exercises",
          durationMinutes: 25,
          difficulty: "medium",
          progress: 0,
          steps: [
            { title: "Warm-up stretches", duration: 5, voiceCue: "Move slowly and gently" },
            { title: "Range of motion exercises", duration: 10, voiceCue: "Focus on smooth movements" },
            { title: "Strengthening exercises", duration: 7, voiceCue: "You're doing great" },
            { title: "Cool down stretches", duration: 3, voiceCue: "Relax and breathe" },
          ],
        },
        {
          id: crypto.randomUUID(),
          type: "cognitive",
          title: "Memory & Focus Training",
          durationMinutes: 15,
          difficulty: "easy",
          progress: 0,
          steps: [
            { title: "Pattern recognition game", duration: 7, voiceCue: "Take your time" },
            { title: "Word association exercise", duration: 5, voiceCue: "Trust your instincts" },
            { title: "Reflection and journaling", duration: 3 },
          ],
        },
      ];

      setRoutineBlocks(mockRoutines);
      setIsGenerating(false);
      
      toast({
        title: "Routine created!",
        description: "Your personalized recovery plan is ready.",
      });
    }, 2000);
  };

  const handleEdit = (block: RoutineBlock) => {
    setEditingBlock(block);
  };

  const handleSave = (updatedBlock: RoutineBlock) => {
    setRoutineBlocks(
      routineBlocks.map((b) => (b.id === updatedBlock.id ? updatedBlock : b))
    );
    toast({
      title: "Changes saved",
      description: "Your routine has been updated.",
    });
  };

  const handleDelete = (id: string) => {
    setRoutineBlocks(routineBlocks.filter((b) => b.id !== id));
    toast({
      title: "Routine deleted",
      description: "The routine block has been removed.",
    });
  };

  const handleRun = (block: RoutineBlock) => {
    setRunningBlock(block);
  };

  const handleComplete = (blockId: string) => {
    setRoutineBlocks(
      routineBlocks.map((b) =>
        b.id === blockId ? { ...b, progress: 100 } : b
      )
    );
    toast({
      title: "Congratulations!",
      description: "You completed this routine. Keep up the great work!",
    });
  };

  const handleExportJSON = () => {
    const data = JSON.stringify(routineBlocks, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rehabot-routines.json";
    a.click();
    toast({
      title: "Export successful",
      description: "Your routines have been downloaded.",
    });
  };

  const handleImportJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const data = JSON.parse(event.target.result);
          setRoutineBlocks(data);
          toast({
            title: "Import successful",
            description: "Your routines have been loaded.",
          });
        } catch (error) {
          toast({
            title: "Import failed",
            description: "Invalid JSON file.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card">
      <Header />
      
      <main className="container mx-auto px-6 pt-24 pb-12">
        {routineBlocks.length === 0 && !isGenerating ? (
          <EmptyState onGetStarted={() => setShowOnboarding(true)} />
        ) : (
          <>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Your Recovery Routines</h2>
                <p className="text-muted-foreground">
                  Personalized activities to support your journey
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={handleImportJSON}
                  data-testid="button-import"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportJSON}
                  disabled={routineBlocks.length === 0}
                  data-testid="button-export"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button
                  onClick={() => setShowOnboarding(true)}
                  disabled={isGenerating}
                  data-testid="button-generate-routine"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isGenerating ? "Generating..." : "Generate New Routine"}
                </Button>
              </div>
            </div>

            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-primary/10 border border-primary/20">
                  <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <span className="text-primary font-medium">Creating your personalized routine...</span>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {routineBlocks.map((block, index) => (
                <div key={block.id} className="relative">
                  <RoutineCard
                    block={block}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    delay={index * 0.1}
                  />
                  <Button
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 shadow-lg"
                    size="sm"
                    onClick={() => handleRun(block)}
                    data-testid={`button-run-${block.id}`}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Routine
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />

      {editingBlock && (
        <EditorModal
          isOpen={!!editingBlock}
          block={editingBlock}
          onClose={() => setEditingBlock(null)}
          onSave={handleSave}
        />
      )}

      {runningBlock && (
        <RunMode
          isOpen={!!runningBlock}
          block={runningBlock}
          onClose={() => setRunningBlock(null)}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
