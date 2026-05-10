// components/InfiniteScrollObserver.tsx
"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollObserverProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  loadingComponent?: React.ReactNode;
  className?: string;
}

export function InfiniteScrollObserver({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  loadingComponent,
  className = "h-10 w-full",
}: InfiniteScrollObserverProps) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [inView, hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <>
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          {loadingComponent || (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Loading more...
            </div>
          )}
        </div>
      )}
      {hasNextPage && <div ref={ref} className={className} />}
    </>
  );
}
