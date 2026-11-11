import { useCallback, useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
};

const getServerSnapshot = () => false;

export const useScrolledPast = (offset: number) => {
  const getSnapshot = useCallback(() => window.scrollY > offset, [offset]);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
