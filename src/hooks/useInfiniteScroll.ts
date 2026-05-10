// hooks/useInfiniteScroll.ts
import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { useMemo } from "react";

// জেনেরিক টাইপ – T হবে প্রতিটি আইটেমের টাইপ, Response হবে তোর API রেসপন্সের টাইপ
interface UseInfiniteScrollProps<TData, TResponse> {
  queryKey: unknown[]; // উদাহরণ: ["idea", "infinite", searchTerm]
  queryFn: (page: number) => Promise<TResponse>; // ফাংশন যা পেজ নম্বর নিয়ে ডাটা ফেচ করে
  limit: number; // প্রতি পেজে কত আইটেম
  getDataFromResponse: (response: TResponse) => TData[]; // রেসপন্স থেকে আইটেমের অ্যারে বের করবে
  getHasMore?: (response: TResponse, limit: number) => boolean; // অপশনাল: পরের পেজ আছে কিনা (ডিফল্ট: আইটেম.length < limit)
  initialPageParam?: number;
  staleTime?: number;
}

export function useInfiniteScroll<TData, TResponse>({
  queryKey,
  queryFn,
  limit,
  getDataFromResponse,
  getHasMore,
  initialPageParam = 1,
  staleTime = 2 * 60 * 1000,
}: UseInfiniteScrollProps<TData, TResponse>) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    initialPageParam,
    queryFn: ({ pageParam }) => queryFn(pageParam as number),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const items = getDataFromResponse(lastPage);
      // কাস্টম hasMore ফাংশন থাকলে সেটা ব্যবহার করবে, না হলে ডিফল্ট লজিক
      if (getHasMore) {
        return getHasMore(lastPage, limit)
          ? (lastPageParam as number) + 1
          : undefined;
      }
      return items.length < limit ? undefined : (lastPageParam as number) + 1;
    },
    staleTime,
  });

  // সব আইটেমকে এক অ্যারেতে ফ্ল্যাট করে দিচ্ছি
  const allItems = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => getDataFromResponse(page));
  }, [data, getDataFromResponse]);

  return {
    data: allItems, // সব আইটেমের অ্যারে
    fetchNextPage, // ফাংশন – হাতে কল করতে চাইলে
    hasNextPage, // boolean – আরো পেজ আছে কিনা
    isFetchingNextPage, // boolean – পরের পেজ লোড হচ্ছে কিনা
    isLoading, // প্রথম লোড
    isError,
    error,
    isFetching, // কোনো লোডিং চলছে কিনা (প্রথম বা পরের)
    refetch, // ডাটা রিফ্রেশ করতে চাইলে
    rawData: data, // পুরো pages array দরকার হলে
  };
}
