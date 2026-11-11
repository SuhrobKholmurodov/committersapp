import { useEffect, useRef, useState } from "react";

interface UseInfiniteScrollOptions {
  enabled: boolean;
  cursor: number;
  onLoadMore: () => void;
  rootMargin?: string;
}

export const useInfiniteScroll = <T extends Element = HTMLDivElement>({
  enabled,
  cursor,
  onLoadMore,
  rootMargin = "400px",
}: UseInfiniteScrollOptions) => {
  const [sentinel, setSentinel] = useState<T | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    if (!sentinel || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMoreRef.current();
        }
      },
      { rootMargin },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinel, enabled, cursor, rootMargin]);

  return setSentinel;
};
