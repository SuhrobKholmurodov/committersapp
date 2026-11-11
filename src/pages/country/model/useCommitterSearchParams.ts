import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DEFAULT_COMMITTER_MODE,
  DEFAULT_COMMITTER_SORT,
  isCommitterMode,
  isCommitterSort,
  type CommitterMode,
  type CommitterSort,
} from "@/entities/committer";

export const useCommitterSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const modeParam = searchParams.get("mode");
  const sortParam = searchParams.get("sort");

  const mode = isCommitterMode(modeParam) ? modeParam : DEFAULT_COMMITTER_MODE;
  const sort = isCommitterSort(sortParam) ? sortParam : DEFAULT_COMMITTER_SORT;
  const search = searchParams.get("search") ?? "";

  const updateParam = useCallback(
    (key: string, value: string, defaultValue: string, replace: boolean) => {
      const nextValue = value === defaultValue ? "" : value;
      if ((searchParams.get(key) ?? "") === nextValue) return;

      const next = new URLSearchParams(searchParams);
      if (nextValue) next.set(key, nextValue);
      else next.delete(key);

      setSearchParams(next, { replace });
    },
    [searchParams, setSearchParams],
  );

  const setMode = useCallback(
    (value: CommitterMode) => updateParam("mode", value, DEFAULT_COMMITTER_MODE, false),
    [updateParam],
  );

  const setSort = useCallback(
    (value: CommitterSort) => updateParam("sort", value, DEFAULT_COMMITTER_SORT, false),
    [updateParam],
  );

  const setSearch = useCallback(
    (value: string) => updateParam("search", value.trim(), "", true),
    [updateParam],
  );

  return { mode, sort, search, setMode, setSort, setSearch };
};
