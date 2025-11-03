import { Header } from "../Header";
import { ThemeProvider } from "../ThemeProvider";

export default function HeaderExample() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Header />
      <div className="h-screen" />
    </ThemeProvider>
  );
}
