import { Moon, Sun } from "lucide-react";
import { useTheme } from "../model/theme";

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="flex items-center justify-center w-10 h-10 transition-transform duration-300 rounded-lg"
    >
      {isDark ? (
        <Moon
          size={28}
          aria-hidden="true"
          className="text-gray-300 transition-transform duration-500"
        />
      ) : (
        <Sun
          size={28}
          aria-hidden="true"
          className="text-yellow-400 transition-transform duration-500"
        />
      )}
    </button>
  );
};
