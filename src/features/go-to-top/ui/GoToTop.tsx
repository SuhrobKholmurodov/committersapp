import { ArrowUp } from "lucide-react";
import { useScrolledPast } from "@/shared/lib/hooks";

const SCROLL_OFFSET = 400;

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export const GoToTop = () => {
  const isVisible = useScrolledPast(SCROLL_OFFSET);

  if (!isVisible) return null;

  return (
    <div className="fixed z-50 flex flex-col items-center gap-3 bottom-6 right-6 animate-fade-in-up">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Go to top"
        className="flex items-center justify-center w-12 h-12 text-white transition-all bg-blue-600 rounded-full shadow-2xl hover:bg-blue-700 active:scale-90"
      >
        <ArrowUp className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
};
