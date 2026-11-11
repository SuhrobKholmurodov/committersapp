import type { ReactNode } from "react";
import Tippy from "@tippyjs/react";
import { CircleQuestionMark } from "lucide-react";
import { ThemeToggle } from "@/features/theme-toggle";
import { cn } from "@/shared/lib/utils";

interface HeaderProps {
  title: string;
  hint?: ReactNode;
  icon?: ReactNode;
  compactTitle?: boolean;
}

export const Header = ({ title, hint, icon, compactTitle = false }: HeaderProps) => (
  <header
    id="header-section"
    className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b dark:border-gray-800 h-[72px] sm:h-[64px] flex items-center"
  >
    <div className="w-full px-4 mx-auto max-w-7xl">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {icon && <span className="mr-1.5 shrink-0 sm:hidden">{icon}</span>}
          <h1
            className={cn(
              "text-[26px] font-bold dark:text-gray-50 truncate",
              compactTitle ? "sm:text-[12px]" : "sm:text-[18px]",
            )}
          >
            {title}
          </h1>
          {hint && (
            <Tippy
              interactive
              placement="bottom"
              content={<span className="max-w-xs text-sm text-gray-300">{hint}</span>}
            >
              <button
                type="button"
                aria-label="About this page"
                className="shrink-0 cursor-help"
              >
                <CircleQuestionMark
                  aria-hidden="true"
                  className="w-5 h-5 mt-1 text-gray-600 dark:text-gray-300 sm:w-4 sm:h-4"
                />
              </button>
            </Tippy>
          )}
        </div>

        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </div>
  </header>
);
