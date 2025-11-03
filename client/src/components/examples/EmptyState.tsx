import { EmptyState } from "../EmptyState";
import { ThemeProvider } from "../ThemeProvider";

export default function EmptyStateExample() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen">
        <EmptyState onGetStarted={() => console.log("Get started clicked")} />
      </div>
    </ThemeProvider>
  );
}
