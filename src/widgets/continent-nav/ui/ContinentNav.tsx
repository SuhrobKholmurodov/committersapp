import { useState } from "react";
import Tippy from "@tippyjs/react";
import { ArrowUp, Check, LayoutGrid } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface ContinentSection {
  id: string;
  name: string;
}

interface ContinentNavProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  sections: ContinentSection[];
  activeId: string;
  onSelect: (id: string) => void;
  floating?: boolean;
}

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const Switch = ({ checked, onChange, label }: SwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={(event) => {
      event.stopPropagation();
      onChange(!checked);
    }}
    className={cn(
      "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none",
      checked ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700",
    )}
  >
    <span
      className={cn(
        "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
        checked ? "translate-x-5" : "translate-x-1",
      )}
    />
  </button>
);

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export const ContinentNav = ({
  enabled,
  onEnabledChange,
  sections,
  activeId,
  onSelect,
  floating = false,
}: ContinentNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (value: boolean) => {
    onEnabledChange(value);
    setIsOpen(false);
  };

  return (
    <>
      {!floating && (
        <nav
          aria-label="Continents"
          className="fixed z-50 block p-4 transform -translate-y-1/2 border shadow-2xl sm:hidden left-6 top-1/2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md dark:border-gray-800 rounded-3xl w-44 xl:left-2 lg:w-40"
        >
          <div className="flex items-center justify-between pb-2 mb-4 border-b dark:border-gray-800">
            <span className="text-[10px] font-black dark:text-white uppercase tracking-widest">
              Grouping
            </span>
            <Switch checked={enabled} onChange={handleToggle} label="Group by continent" />
          </div>
          {enabled && sections.length > 0 && (
            <div className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto pr-1">
              {sections.map((section) => (
                <button
                  type="button"
                  key={section.id}
                  onClick={() => onSelect(section.id)}
                  aria-current={activeId === section.id ? "true" : undefined}
                  className={cn(
                    "text-left text-[10px] uppercase font-bold p-2 rounded-lg transition-all",
                    activeId === section.id
                      ? "bg-blue-600 text-white shadow-lg translate-x-1"
                      : "text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30",
                  )}
                >
                  {section.name}
                </button>
              ))}
              <button
                type="button"
                onClick={scrollToTop}
                className="mt-2 pt-2 border-t dark:border-gray-700 flex items-center justify-center gap-1 text-[9px] font-black text-blue-400 hover:text-blue-600 uppercase"
              >
                <ArrowUp className="w-3 h-3" aria-hidden="true" /> Top
              </button>
            </div>
          )}
        </nav>
      )}

      <div className={floating ? "block" : "hidden sm:block"}>
        <Tippy
          interactive
          visible={isOpen}
          onClickOutside={() => setIsOpen(false)}
          offset={[0, 15]}
          placement={floating ? "left" : "bottom"}
          theme="custom"
          content={
            <div className="p-2 bg-white border border-gray-100 shadow-2xl dark:bg-gray-900 rounded-2xl dark:border-gray-800 w-60">
              <div className="flex items-center justify-between p-3 mb-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex flex-col text-left">
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Group by Region
                  </span>
                  <span className="text-[9px] text-gray-500 dark:text-gray-400 font-medium">
                    Sort by continent
                  </span>
                </div>
                <Switch checked={enabled} onChange={handleToggle} label="Group by continent" />
              </div>
              {enabled && sections.length > 0 ? (
                <div className="flex flex-col gap-0.5 max-h-[40vh] overflow-y-auto p-1">
                  {sections.map((section) => (
                    <button
                      type="button"
                      key={section.id}
                      onClick={() => {
                        onSelect(section.id);
                        setIsOpen(false);
                      }}
                      aria-current={activeId === section.id ? "true" : undefined}
                      className={cn(
                        "text-left text-[11px] uppercase font-bold p-3 rounded-xl flex items-center justify-between",
                        activeId === section.id
                          ? "text-blue-600 bg-blue-50 dark:bg-blue-900/40"
                          : "text-gray-500 active:bg-gray-100 dark:active:bg-gray-800",
                      )}
                    >
                      {section.name}
                      {activeId === section.id && (
                        <Check className="w-3 h-3 text-blue-600" aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center">
                  <LayoutGrid className="w-5 h-5 mx-auto mb-2 text-gray-400" aria-hidden="true" />
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                    Grouping Disabled
                  </p>
                </div>
              )}
            </div>
          }
        >
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label="Group countries by continent"
            aria-expanded={isOpen}
            className={cn(
              "flex items-center justify-center transition-all shadow-lg border",
              floating ? "w-12 h-12 rounded-full" : "p-[10px] w-[46px] h-[46px] rounded-2xl",
              enabled
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-blue-500",
            )}
          >
            <LayoutGrid className="w-5 h-5 text-current" aria-hidden="true" />
          </button>
        </Tippy>
      </div>
    </>
  );
};
