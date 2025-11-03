import { ThemeProvider } from "../ThemeProvider";
import { ThemeSwitcher } from "../ThemeSwitcher";

export default function ThemeProviderExample() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="p-8">
        <div className="flex items-center gap-4">
          <p>Theme Switcher:</p>
          <ThemeSwitcher />
        </div>
      </div>
    </ThemeProvider>
  );
}
