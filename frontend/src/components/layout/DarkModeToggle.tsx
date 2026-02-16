import { useDarkMode } from "../../context/DarkModeContext";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const { darkMode, setDarkMode } = useDarkMode();

  const ariaLabel = darkMode
    ? "Zum hellen Modus wechseln"
    : "Zum dunklen Modus wechseln";

  return (
    <button
      type="button"
      onClick={() => setDarkMode(!darkMode)}
      aria-label={ariaLabel}
      aria-pressed={darkMode}
      className="
        p-2 rounded-xl border 
        bg-white/50 dark:bg-gray-800/50 
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition-all
      "
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
