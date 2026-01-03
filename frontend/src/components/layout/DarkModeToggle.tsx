import { useDarkMode } from "../../context/DarkModeContext";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
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
