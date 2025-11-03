import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, SkipForward, SkipBack, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Step = {
  title: string;
  duration: number;
  voiceCue?: string;
};

type RoutineBlock = {
  id: string;
  type: "motivational" | "exercise" | "cognitive";
  title: string;
  durationMinutes: number;
  difficulty: "easy" | "medium" | "hard";
  progress: number;
  steps: Step[];
};

type RunModeProps = {
  isOpen: boolean;
  block: RoutineBlock | null;
  onClose: () => void;
  onComplete: (blockId: string) => void;
};

export function RunMode({ isOpen, block, onClose, onComplete }: RunModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (block && currentStep < block.steps.length) {
      setTimeRemaining(block.steps[currentStep].duration * 60);
    }
  }, [currentStep, block]);

  useEffect(() => {
    if (!isPlaying || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (block && currentStep < block.steps.length - 1) {
            setCurrentStep(currentStep + 1);
            return block.steps[currentStep + 1].duration * 60;
          } else {
            setIsPlaying(false);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, currentStep, block]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleNext = () => {
    if (block && currentStep < block.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setIsPlaying(false);
    }
  };

  const handleComplete = () => {
    if (block) {
      onComplete(block.id);
      onClose();
    }
  };

  if (!block) return null;

  const progress = block.steps.length > 0 
    ? ((currentStep + 1) / block.steps.length) * 100 
    : 0;
  const currentStepData = block.steps[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-2xl"
          >
            <Card className="p-8 backdrop-blur-xl bg-card/95 border-card-border shadow-2xl">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                onClick={onClose}
                data-testid="button-close-run-mode"
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">{block.title}</h2>
                <p className="text-muted-foreground">
                  Step {currentStep + 1} of {block.steps.length}
                </p>
              </div>

              <div className="mb-8">
                <Progress value={progress} className="h-3 mb-2" />
                <div className="text-sm text-muted-foreground text-center">
                  {Math.round(progress)}% Complete
                </div>
              </div>

              {currentStepData && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center mb-12"
                >
                  <h3 className="text-2xl font-semibold mb-4" data-testid="text-current-step">
                    {currentStepData.title}
                  </h3>
                  <div className="text-6xl font-mono font-bold text-primary mb-4" data-testid="text-timer">
                    {formatTime(timeRemaining)}
                  </div>
                  {currentStepData.voiceCue && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-lg text-secondary italic"
                      data-testid="text-voice-cue"
                    >
                      "{currentStepData.voiceCue}"
                    </motion.p>
                  )}
                </motion.div>
              )}

              <div className="flex items-center justify-center gap-4 mb-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  data-testid="button-prev-step"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  className="h-16 w-16 rounded-full"
                  onClick={() => setIsPlaying(!isPlaying)}
                  data-testid="button-play-pause"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={currentStep === block.steps.length - 1}
                  data-testid="button-next-step"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              {currentStep === block.steps.length - 1 && timeRemaining === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Button onClick={handleComplete} className="w-full" data-testid="button-complete-routine">
                    <Check className="mr-2 h-5 w-5" />
                    Mark as Complete
                  </Button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
