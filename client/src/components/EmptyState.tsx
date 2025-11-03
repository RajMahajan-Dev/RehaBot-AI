import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  onGetStarted: () => void;
};

export function EmptyState({ onGetStarted }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-[60vh]"
    >
      <Card className="max-w-md p-12 text-center backdrop-blur-xl bg-card/80 border-card-border">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-3">Start Your Recovery Journey</h2>
        <p className="text-muted-foreground mb-8">
          Create your first personalized routine powered by AI. Get motivational support, exercise plans, and cognitive activities tailored to your needs.
        </p>
        <Button size="lg" onClick={onGetStarted} className="w-full" data-testid="button-get-started">
          <Sparkles className="mr-2 h-5 w-5" />
          Get Started
        </Button>
      </Card>
    </motion.div>
  );
}
