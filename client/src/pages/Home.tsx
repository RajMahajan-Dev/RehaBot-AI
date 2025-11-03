import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Upload, Share2, Sparkles, Play, FileText } from "lucide-react";
import { Header } from "@/components/Header";
import { OnboardingModal } from "@/components/OnboardingModal";
import { RoutineCard } from "@/components/RoutineCard";
import { EditorModal } from "@/components/EditorModal";
import { RunMode } from "@/components/RunMode";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

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

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate routine");
      }

      const routine = await response.json();
      
      // Flatten all blocks from all days into a single array for UI display
      const allBlocks: RoutineBlock[] = routine.days.flatMap((day: any) => 
        day.blocks.map((block: any) => ({
          ...block,
          id: block.id || crypto.randomUUID(),
        }))
      );

      setRoutineBlocks(allBlocks);
      
      // Save the complete routine structure to backend
      try {
        await fetch("/api/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            routine,
            metadata: {
              name: `${data.injuryType} Recovery Plan`,
              userProfile: data,
            },
          }),
        });
      } catch (saveError) {
        console.error("Failed to save routine to backend:", saveError);
        // Non-critical error, routine is still displayed
      }
      
      setIsGenerating(false);
      
      toast({
        title: "Routine created!",
        description: "Your personalized recovery plan is ready.",
      });
    } catch (error: any) {
      console.error("Error generating routine:", error);
      setIsGenerating(false);
      
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate routine. Please try again.",
        variant: "destructive",
      });
    }
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

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(15, 98, 254);
    doc.text("RehaBot: Recovery Routines", margin, yPos);
    yPos += 10;

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPos);
    yPos += 15;

    // Routines
    routineBlocks.forEach((block, index) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Block header
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. ${block.title}`, margin, yPos);
      yPos += 7;

      // Block details
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(
        `Type: ${block.type} | Duration: ${block.durationMinutes} min | Difficulty: ${block.difficulty}`,
        margin + 5,
        yPos
      );
      yPos += 10;

      // Steps
      doc.setFontSize(9);
      block.steps.forEach((step, stepIndex) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        const stepText = `  ${stepIndex + 1}. ${step.title} (${step.duration} min)`;
        doc.text(stepText, margin + 10, yPos);
        yPos += 5;

        if (step.voiceCue) {
          doc.setTextColor(120, 120, 120);
          doc.text(`     "${step.voiceCue}"`, margin + 15, yPos);
          doc.setTextColor(80, 80, 80);
          yPos += 5;
        }
      });

      yPos += 10;
    });

    doc.save("rehabot-routines.pdf");
    
    toast({
      title: "PDF exported",
      description: "Your routines have been saved as PDF.",
    });
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
                  Export JSON
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportPDF}
                  disabled={routineBlocks.length === 0}
                  data-testid="button-export-pdf"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export PDF
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
