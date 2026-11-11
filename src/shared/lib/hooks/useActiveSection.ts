import { useEffect, useState } from "react";

export const useActiveSection = (ids: string[], enabled: boolean) => {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!enabled || ids.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [ids, enabled]);

  return activeId;
};
