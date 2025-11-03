import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

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

type EditorModalProps = {
  isOpen: boolean;
  block: RoutineBlock | null;
  onClose: () => void;
  onSave: (block: RoutineBlock) => void;
};

export function EditorModal({ isOpen, block, onClose, onSave }: EditorModalProps) {
  const [editedBlock, setEditedBlock] = useState<RoutineBlock | null>(block);

  const handleSave = () => {
    if (editedBlock) {
      onSave(editedBlock);
      onClose();
    }
  };

  const addStep = () => {
    if (editedBlock) {
      setEditedBlock({
        ...editedBlock,
        steps: [
          ...editedBlock.steps,
          { title: "", duration: 5, voiceCue: "" },
        ],
      });
    }
  };

  const removeStep = (index: number) => {
    if (editedBlock) {
      setEditedBlock({
        ...editedBlock,
        steps: editedBlock.steps.filter((_, i) => i !== index),
      });
    }
  };

  const updateStep = (index: number, field: string, value: string | number) => {
    if (editedBlock) {
      const newSteps = [...editedBlock.steps];
      newSteps[index] = { ...newSteps[index], [field]: value };
      setEditedBlock({ ...editedBlock, steps: newSteps });
    }
  };

  if (!editedBlock) return null;

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
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="p-8 backdrop-blur-xl bg-card/95 border-card-border shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Edit Routine Block</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  data-testid="button-close-editor"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-secondary">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={editedBlock.title}
                      onChange={(e) =>
                        setEditedBlock({ ...editedBlock, title: e.target.value })
                      }
                      className="mt-2"
                      data-testid="input-edit-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type" className="text-secondary">
                      Type
                    </Label>
                    <Select
                      value={editedBlock.type}
                      onValueChange={(value: any) =>
                        setEditedBlock({ ...editedBlock, type: value })
                      }
                    >
                      <SelectTrigger className="mt-2" data-testid="select-edit-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="motivational">Motivational</SelectItem>
                        <SelectItem value="exercise">Exercise</SelectItem>
                        <SelectItem value="cognitive">Cognitive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration" className="text-secondary">
                      Duration (minutes)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      value={editedBlock.durationMinutes}
                      onChange={(e) =>
                        setEditedBlock({
                          ...editedBlock,
                          durationMinutes: parseInt(e.target.value),
                        })
                      }
                      className="mt-2"
                      data-testid="input-edit-duration"
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty" className="text-secondary">
                      Difficulty
                    </Label>
                    <Select
                      value={editedBlock.difficulty}
                      onValueChange={(value: any) =>
                        setEditedBlock({ ...editedBlock, difficulty: value })
                      }
                    >
                      <SelectTrigger className="mt-2" data-testid="select-edit-difficulty">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-secondary">Steps</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addStep}
                      data-testid="button-add-step"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Step
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {editedBlock.steps.map((step, idx) => (
                      <Card key={idx} className="p-4 bg-muted/30">
                        <div className="flex gap-3 items-start">
                          <div className="flex-1 space-y-3">
                            <Input
                              placeholder="Step title"
                              value={step.title}
                              onChange={(e) =>
                                updateStep(idx, "title", e.target.value)
                              }
                              data-testid={`input-step-title-${idx}`}
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                type="number"
                                placeholder="Duration (min)"
                                value={step.duration}
                                onChange={(e) =>
                                  updateStep(idx, "duration", parseInt(e.target.value))
                                }
                                data-testid={`input-step-duration-${idx}`}
                              />
                              <Input
                                placeholder="Voice cue (optional)"
                                value={step.voiceCue || ""}
                                onChange={(e) =>
                                  updateStep(idx, "voiceCue", e.target.value)
                                }
                                data-testid={`input-step-cue-${idx}`}
                              />
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeStep(idx)}
                            data-testid={`button-remove-step-${idx}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="flex-1" data-testid="button-save-changes">
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
