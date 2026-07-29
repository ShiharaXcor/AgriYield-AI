import { Moon, Sun, Bell } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";

function Navbar() {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <header className="h-16 bg-white dark:bg-surface-dark border-b border-black/5 dark:border-white/10 flex items-center justify-between px-8 sticky top-0 z-10">
      <div>
        <p className="text-sm text-stone font-body">Welcome back,</p>
        <p className="font-display font-medium text-ink dark:text-canvas">Farm Manager</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-full hover:bg-canvas dark:hover:bg-white/5 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} className="text-stone" />
        </button>

        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full hover:bg-canvas dark:hover:bg-white/5 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={20} className="text-gold" /> : <Moon size={20} className="text-stone" />}
        </button>

        <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-white font-body font-medium text-sm">
          FM
        </div>
      </div>
    </header>
  );
}

export default Navbar;