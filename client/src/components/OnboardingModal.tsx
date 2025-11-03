import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

type OnboardingData = {
  injuryType: string;
  mobilityLevel: string;
  dailyTime: string;
  intensity: string;
  goals: string;
};

type OnboardingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingData) => void;
};

export function OnboardingModal({
  isOpen,
  onClose,
  onComplete,
}: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    injuryType: "",
    mobilityLevel: "",
    dailyTime: "",
    intensity: "",
    goals: "",
  });

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    onComplete(formData);
    onClose();
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.injuryType.length > 0;
      case 2:
        return formData.mobilityLevel.length > 0;
      case 3:
        return formData.dailyTime.length > 0;
      case 4:
        return formData.intensity.length > 0;
      case 5:
        return formData.goals.length > 0;
      default:
        return false;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md"
          >
            <Card className="p-8 backdrop-blur-xl bg-card/95 border-card-border shadow-xl">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                onClick={onClose}
                data-testid="button-close-onboarding"
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Let's Get Started</h2>
                <p className="text-sm text-muted-foreground">
                  Step {step} of 5
                </p>
                <div className="flex gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        i <= step ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 mb-8"
                >
                  {step === 1 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="injuryType" className="text-secondary">
                          What type of recovery are you pursuing?
                        </Label>
                        <Input
                          id="injuryType"
                          placeholder="e.g., Knee surgery, addiction recovery, mental health"
                          value={formData.injuryType}
                          onChange={(e) =>
                            setFormData({ ...formData, injuryType: e.target.value })
                          }
                          className="mt-2"
                          data-testid="input-injury-type"
                        />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="mobilityLevel" className="text-secondary">
                          What's your current mobility level?
                        </Label>
                        <Select
                          value={formData.mobilityLevel}
                          onValueChange={(value) =>
                            setFormData({ ...formData, mobilityLevel: value })
                          }
                        >
                          <SelectTrigger
                            className="mt-2"
                            data-testid="select-mobility-level"
                          >
                            <SelectValue placeholder="Select mobility level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="limited">Limited - Need assistance</SelectItem>
                            <SelectItem value="moderate">Moderate - Some independence</SelectItem>
                            <SelectItem value="good">Good - Mostly independent</SelectItem>
                            <SelectItem value="excellent">Excellent - Fully mobile</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dailyTime" className="text-secondary">
                          How much time can you dedicate daily?
                        </Label>
                        <Select
                          value={formData.dailyTime}
                          onValueChange={(value) =>
                            setFormData({ ...formData, dailyTime: value })
                          }
                        >
                          <SelectTrigger
                            className="mt-2"
                            data-testid="select-daily-time"
                          >
                            <SelectValue placeholder="Select time commitment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="90">1.5 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="intensity" className="text-secondary">
                          What intensity level works for you?
                        </Label>
                        <Select
                          value={formData.intensity}
                          onValueChange={(value) =>
                            setFormData({ ...formData, intensity: value })
                          }
                        >
                          <SelectTrigger
                            className="mt-2"
                            data-testid="select-intensity"
                          >
                            <SelectValue placeholder="Select intensity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gentle">Gentle - Take it easy</SelectItem>
                            <SelectItem value="moderate">Moderate - Steady progress</SelectItem>
                            <SelectItem value="challenging">Challenging - Push yourself</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="goals" className="text-secondary">
                          What are your recovery goals?
                        </Label>
                        <Textarea
                          id="goals"
                          placeholder="Share your goals and what you hope to achieve..."
                          value={formData.goals}
                          onChange={(e) =>
                            setFormData({ ...formData, goals: e.target.value })
                          }
                          className="mt-2 min-h-[120px]"
                          data-testid="input-goals"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-3">
                {step > 1 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                    data-testid="button-back"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
                {step < 5 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex-1"
                    data-testid="button-next"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed()}
                    className="flex-1"
                    data-testid="button-complete-onboarding"
                  >
                    Complete Setup
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
