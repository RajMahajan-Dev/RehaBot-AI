import { useState } from "react";
import { OnboardingModal } from "../OnboardingModal";
import { ThemeProvider } from "../ThemeProvider";
import { Button } from "@/components/ui/button";

export default function OnboardingModalExample() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>Open Onboarding</Button>
        <OnboardingModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onComplete={(data) => {
            console.log("Onboarding complete:", data);
            setIsOpen(false);
          }}
        />
      </div>
    </ThemeProvider>
  );
}
