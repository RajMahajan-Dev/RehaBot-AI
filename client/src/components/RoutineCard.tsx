import { motion } from "framer-motion";
import { Edit2, Trash2, Heart, Dumbbell, Brain, Clock, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

type RoutineCardProps = {
  block: RoutineBlock;
  onEdit: (block: RoutineBlock) => void;
  onDelete: (id: string) => void;
  delay?: number;
};

const typeConfig = {
  motivational: {
    icon: Heart,
    color: "text-accent",
    bgColor: "bg-accent/10",
    label: "Motivational",
  },
  exercise: {
    icon: Dumbbell,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    label: "Exercise",
  },
  cognitive: {
    icon: Brain,
    color: "text-primary",
    bgColor: "bg-primary/10",
    label: "Cognitive",
  },
};

const difficultyConfig = {
  easy: { label: "Easy", color: "bg-green-500/20 text-green-400" },
  medium: { label: "Medium", color: "bg-yellow-500/20 text-yellow-400" },
  hard: { label: "Hard", color: "bg-red-500/20 text-red-400" },
};

export function RoutineCard({ block, onEdit, onDelete, delay = 0 }: RoutineCardProps) {
  const config = typeConfig[block.type];
  const Icon = config.icon;
  const diffConfig = difficultyConfig[block.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card
        className="p-6 backdrop-blur-lg bg-card/80 border-card-border hover-elevate group relative overflow-visible"
        style={{
          boxShadow: `0 8px 32px -8px hsl(var(--${block.type === 'motivational' ? 'accent' : block.type === 'exercise' ? 'secondary' : 'primary'}) / 0.3)`,
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${config.bgColor}`}>
              <Icon className={`h-5 w-5 ${config.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-lg" data-testid={`text-block-title-${block.id}`}>
                {block.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={diffConfig.color}>
                  {diffConfig.label}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {block.durationMinutes} min
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(block)}
              data-testid={`button-edit-${block.id}`}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(block.id)}
              data-testid={`button-delete-${block.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {block.steps.slice(0, 3).map((step, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{step.title}</span>
              <span className="text-xs">({step.duration}m)</span>
            </div>
          ))}
          {block.steps.length > 3 && (
            <div className="text-xs text-muted-foreground pl-3.5">
              +{block.steps.length - 3} more steps
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Progress
            </span>
            <span className="font-medium" data-testid={`text-progress-${block.id}`}>
              {block.progress}%
            </span>
          </div>
          <Progress value={block.progress} className="h-2" />
        </div>
      </Card>
    </motion.div>
  );
}
