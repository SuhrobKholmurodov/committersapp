import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const THEME_CHANGE_EVENT = "themechange";

const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "dark";

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
};

const getSnapshot = (): Theme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

const getServerSnapshot = (): Theme => "light";

const subscribe = (onChange: () => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY || !isTheme(event.newValue)) return;
    applyTheme(event.newValue);
    onChange();
  };

  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", handleStorage);
  };
};

const persistTheme = (theme: Theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
    return true;
  } catch {
    return false;
  }
};

const setTheme = (theme: Theme) => {
  applyTheme(theme);
  persistTheme(theme);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
};

export const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [theme],
  );

  return { theme, isDark: theme === "dark", toggleTheme };
};
