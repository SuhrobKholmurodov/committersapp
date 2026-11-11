import { useState } from "react";
import Tippy from "@tippyjs/react";
import { RefreshCw } from "lucide-react";
import {
  COMMITTER_MODES,
  isCommitterMode,
  isCommitterSort,
  type CommitterMode,
  type CommitterSort,
} from "@/entities/committer";
import { showToast } from "@/shared/lib/toast";
import { cn } from "@/shared/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";

const SORT_LABELS: Record<CommitterSort, string> = {
  "commits-desc": "Most Commits",
  "commits-asc": "Least Commits",
  "alphabetical-asc": "Name (A-Z)",
  "alphabetical-desc": "Name (Z-A)",
};

const SORT_ENTRIES = Object.entries(SORT_LABELS) as Array<[CommitterSort, string]>;

interface FilterBarProps {
  mode: CommitterMode;
  sort: CommitterSort;
  isFetching: boolean;
  onModeChange: (mode: CommitterMode) => void;
  onSortChange: (sort: CommitterSort) => void;
  onRefresh: () => Promise<boolean>;
}

export const FilterBar = ({
  mode,
  sort,
  isFetching,
  onModeChange,
  onSortChange,
  onRefresh,
}: FilterBarProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isBusy = isFetching || isRefreshing;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const isSuccess = await onRefresh();
      showToast(
        isSuccess ? "success" : "error",
        isSuccess ? "Ranking updated" : "Failed to refresh data",
      );
    } catch {
      showToast("error", "Update failed");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="sticky top-[60px] z-30 mb-8 p-2 backdrop-blur-xl bg-white/10 dark:bg-gray-950/10 border-[1px] border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
      <div className="flex flex-row items-center justify-between gap-3 sm:flex-col">
        <div className="flex items-center w-full gap-3 sm:gap-1 sm:w-auto">
          <ToggleGroup
            type="single"
            value={mode}
            aria-label="Ranking type"
            onValueChange={(value) => isCommitterMode(value) && onModeChange(value)}
            className="flex w-full gap-2 p-1 bg-gray-200/50 dark:bg-gray-900/90 rounded-xl sm:w-auto"
          >
            {COMMITTER_MODES.map((value) => (
              <ToggleGroupItem
                key={value}
                value={value}
                className="flex-1 sm:flex-none px-8 sm:px-4 py-2 rounded-lg capitalize text-sm font-medium transition-all
                  hover:bg-white/80 dark:hover:bg-gray-800/80 hover:text-blue-600
                  data-[state=on]:bg-white dark:data-[state=on]:bg-gray-800
                  data-[state=on]:text-blue-600 dark:data-[state=on]:text-blue-400
                  data-[state=on]:shadow-sm data-[state=on]:hover:bg-white dark:data-[state=on]:hover:bg-gray-800"
              >
                {value}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <Tippy content="Refresh database" placement="top">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isBusy}
              aria-label="Refresh ranking"
              className="p-3 text-gray-500 transition-all rounded-xl bg-gray-200/50 dark:bg-gray-900/90 hover:text-blue-600 disabled:opacity-50 hover:scale-105 active:scale-95"
            >
              <RefreshCw
                aria-hidden="true"
                className={cn("w-5 h-5", isBusy && "animate-spin")}
              />
            </button>
          </Tippy>
        </div>

        <div className="flex flex-row items-center w-full gap-3 sm:flex-col">
          <Select
            value={sort}
            onValueChange={(value) => isCommitterSort(value) && onSortChange(value)}
          >
            <SelectTrigger
              aria-label="Sort by"
              className="w-full sm:w-full md:w-[180px] h-11 rounded-xl bg-gray-200/50 dark:bg-gray-900/90 border-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-gray-200"
            >
              <SelectValue placeholder="Sort by">{SORT_LABELS[sort]}</SelectValue>
            </SelectTrigger>
            <SelectContent className="border-gray-200 backdrop-blur-xl bg-white/90 dark:bg-gray-950/90 dark:border-gray-800">
              {SORT_ENTRIES.map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
