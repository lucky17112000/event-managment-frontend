"use client";

import { getidea } from "@/services/idea.services";
import { getBookingDetailsByideaIdAction } from "@/services/admin.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { IideaResponse } from "@/types/idea.type";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarDays,
  Clock3,
  Loader2,
  Search,
  Sprout,
  MapPin,
  Ticket,
  X,
  Calendar,
} from "lucide-react";
import { createPurchaseAction } from "@/services/purchase.service";
import AppTooltip from "@/components/shared/Tooltip";
import { EcoCardSkeleton, EcoSpinner } from "@/components/shared/EcoLoading";
import { ideaCardShell } from "@/components/shared/IdeaCardShell";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { ApiResponse } from "@/types/api.types";
import { InfiniteScrollObserver } from "@/components/InfiniteScrollObserver";

// ─── Pagination helper ────────────────────────────────────────────────────────
type pageItem = number | "ellipsis";
const getPaginationItems = (currentPage: number, totalPages: number) => {
  const safeTotal = Math.max(1, totalPages);
  const safeCurrent = Math.min(Math.max(1, currentPage), safeTotal);
  if (safeTotal <= 7) {
    return Array.from({ length: safeTotal }, (_, idx) => idx + 1) as pageItem[];
  }
  const items: pageItem[] = [3];
  const left = Math.max(2, safeCurrent - 1);
  const right = Math.min(safeTotal - 1, safeCurrent + 1);
  if (left >= 2) items.push("ellipsis");
  for (let p = left; p <= right; p += 1) items.push(p);
  if (right < safeTotal - 1) items.push("ellipsis");
  items.push(safeTotal);
  return items;
};

const DEFAULT_idea_IMAGE = "/window.svg";

type ImageLike = string | { url?: unknown };
type VoteLike = string | { type?: unknown };
type VoteRecordLike = { userId?: unknown; type?: unknown; voteType?: unknown };
type PurchaseRecordLike = { userId?: unknown; paymentStatus?: unknown };

const getVoteType = (vote: VoteLike): "UP" | "DOWN" | null => {
  if (vote === "UP" || vote === "DOWN") return vote;
  if (vote && typeof vote === "object") {
    const maybeType = (vote as { type?: unknown }).type;
    return maybeType === "UP" || maybeType === "DOWN" ? maybeType : null;
  }
  return null;
};

const getVoteTypeFromRecord = (vote: unknown): "UP" | "DOWN" | null => {
  if (vote === "UP" || vote === "DOWN") return vote;
  if (!vote || typeof vote !== "object") return null;
  const record = vote as VoteRecordLike;
  const maybeType = record.type ?? record.voteType;
  return maybeType === "UP" || maybeType === "DOWN" ? maybeType : null;
};

const getVoteUserIdFromRecord = (vote: unknown): string | null => {
  if (!vote || typeof vote !== "object") return null;
  const record = vote as VoteRecordLike;
  return typeof record.userId === "string" ? record.userId : null;
};

const isideaPurchasedByUser = (idea: IideaResponse | null, userId: string) => {
  if (!idea?.isPaid) return false;
  const purchases = (idea as unknown as { purchases?: unknown }).purchases;
  if (!Array.isArray(purchases) || purchases.length === 0) return false;
  return purchases.some((purchase) => {
    if (!purchase || typeof purchase !== "object") return false;
    const record = purchase as PurchaseRecordLike;
    if (record.paymentStatus !== "PAID") return false;
    if (typeof record.userId === "string") return record.userId === userId;
    return true;
  });
};

const normalizeImageUrls = (images: unknown): string[] => {
  if (!Array.isArray(images)) return [];
  const urls = images
    .map((item) => {
      const typedItem = item as ImageLike;
      if (typeof typedItem === "string") return typedItem.trim();
      if (typedItem && typeof typedItem === "object") {
        const url = typedItem.url;
        return typeof url === "string" ? url.trim() : "";
      }
      return "";
    })
    .filter(Boolean);
  return urls;
};

const safeFormatDate = (value: unknown) => {
  if (!value) return "";
  const date =
    value instanceof Date
      ? value
      : typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
};

const pickImage = (urls: string[], preferredIndex: number): string => {
  return urls[preferredIndex] || urls[0] || DEFAULT_idea_IMAGE;
};

type BookingDetailsRecord = {
  id?: string;
  bookingCode?: string;
  userId?: string;
  seatCount?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

type BookingDetailsPayload = {
  availableSeats?: number;
  totalBookings?: number;
  seatConfig?: {
    totalSeats?: number;
    bookedSeats?: number;
    venue?: string;
    startTime?: string;
    endTime?: string;
  };
  bookings?: BookingDetailsRecord[];
};

const safeFormatDateTime = (value: unknown) => {
  if (!value) return "";
  const date =
    value instanceof Date
      ? value
      : typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const getStatusStyles = (status?: string) => {
  const normalized = String(status ?? "").toUpperCase();

  if (normalized === "CONFIRMED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalized === "PENDING") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (normalized === "CANCELLED" || normalized === "CANCELED") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-zinc-200 bg-zinc-50 text-zinc-600";
};

// ─── Main component ───────────────────────────────────────────────────────────

const LOCAL_BOOKED_KEY = "ideaHub_bookedideaIds";

const ideaManagmentPage = ({ user }: { user?: unknown }) => {
  // ── State ────────────────────────────────────────────────────────────────
  // Persisted locally so "Already Booked" survives page navigation
  const [bookingDetailsDialog, setBookingDetailsDialog] = useState<{
    open: boolean;
    loading: boolean;
    error: string;
    ideaId: string;
    ideaTitle: string;
    data: BookingDetailsPayload | null;
    message: string;
  }>({
    open: false,
    loading: false,
    error: "",
    ideaId: "",
    ideaTitle: "",
    data: null,
    message: "",
  });

  // Search state — preserved as-is for future commands
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 400);
    return () => clearTimeout(t);
  }, [searchText]);

  // useEffect(() => {
  //   setPage(1);
  // }, [debouncedSearch]);

  const router = useRouter();
  const queryClient = useQueryClient();
  // const [page, setPage] = useState(1);
  const [limit] = useState(6);

  const userId =
    user &&
    typeof user === "object" &&
    "id" in (user as Record<string, unknown>)
      ? String((user as Record<string, unknown>).id ?? "")
      : user &&
          typeof user === "object" &&
          "data" in (user as Record<string, unknown>) &&
          (user as { data?: unknown }).data &&
          typeof (user as { data?: unknown }).data === "object" &&
          "id" in ((user as { data?: unknown }).data as Record<string, unknown>)
        ? String(
            (((user as { data?: unknown }).data as Record<string, unknown>)
              .id as unknown) ?? "",
          )
        : "";

  // const { data, isLoading, isError, isFetching } = useQuery({
  //   queryKey: ["idea", page, limit, debouncedSearch],
  //   queryFn: () =>
  //     getidea({
  //       page,
  //       limit,
  //       status: "APPROVED",
  //       searchTerm: debouncedSearch || undefined,
  //     }),
  // });
  // console.log("Fetched ideas data:", data);
  const LIMIT = 3; // আগের limit স্টেটের মান

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useInfiniteScroll<IideaResponse, ApiResponse<IideaResponse[]>>({
    queryKey: ["idea", "infinite", LIMIT, debouncedSearch],
    queryFn: (page) =>
      getidea({
        page,
        limit: LIMIT,
        status: "APPROVED",
        searchTerm: debouncedSearch || undefined,
      }),
    limit: LIMIT,
    getDataFromResponse: (response) => response?.data ?? [],
  });

  const purchaseMutation = useMutation({
    mutationFn: createPurchaseAction,
    onSuccess: (res) => {
      const url = res?.data?.sessionUrl;
      if (typeof url === "string" && url.length > 0) {
        window.location.assign(url);
        return;
      }
      console.error("sessionUrl missing in purchase response:", res);
    },
    onError: (err) => {
      console.error("Purchase failed:", err);
    },
  });

  // const meta = data?.meta;
  // const totalPages = Math.max(1, meta?.totalPages ?? 1);
  // const currentPage = Math.min(Math.max(1, meta?.page ?? page), totalPages);
  // const totalItems = meta?.total ?? undefined;

  // useEffect(() => {
  //   if (page !== currentPage) setPage(currentPage);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentPage, totalPages]);

  // const canGoPrev = currentPage > 1;
  // const canGoNext = currentPage < totalPages;
  // const paginationItems = useMemo(
  //   () => getPaginationItems(currentPage, totalPages),
  //   [currentPage, totalPages],
  // );
  // const showingRange = useMemo(() => {
  //   if (typeof totalItems !== "number") return null;
  //   if (totalItems <= 0) return null;
  //   const start = (currentPage - 1) * limit + 1;
  //   const end = Math.min(currentPage * limit, totalItems);
  //   return { start, end, total: totalItems };
  // }, [currentPage, limit, totalItems]);

  // const ideas = useMemo(
  //   () => (Array.isArray(data?.data) ? data.data : ([] as IideaResponse[])),
  //   [data],
  // );
  // console.log("Normalized ideas array:", ideas.map((idea) => idea.ideaId));
  const ideas = useMemo(() => infiniteData ?? [], [infiniteData]);

  const loadBookingDetails = async (idea: IideaResponse) => {
    setBookingDetailsDialog({
      open: true,
      loading: true,
      error: "",
      ideaId: idea.id,
      ideaTitle: idea.title || "Untitled idea",
      data: null,
      message: "",
    });

    try {
      const response = await getBookingDetailsByideaIdAction(idea.id);
      console.log("Booking details by idea id:", {
        ideaId: idea.id,
        response,
      });

      if (!response?.success) {
        setBookingDetailsDialog((prev) => ({
          ...prev,
          loading: false,
          error:
            response?.message ||
            "Failed to fetch booking details. Please try again.",
          data: null,
          message: response?.message || "",
        }));
        return;
      }

      setBookingDetailsDialog((prev) => ({
        ...prev,
        loading: false,
        error: "",
        data: (response.data ?? null) as BookingDetailsPayload | null,
        message: response?.message || "",
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch booking details. Please try again.";
      setBookingDetailsDialog((prev) => ({
        ...prev,
        loading: false,
        error: message,
        data: null,
      }));
    }
  };

  // Search-awareness flags — used by parent commands
  const isSearching = debouncedSearch.length > 0;
  const showSkeletonGrid = isLoading || (isFetching && isSearching);

  const underReviewideas = useMemo(
    () => ideas.filter((idea) => idea?.status === "APPROVED"),
    [ideas],
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full animate-eco-fade-down animate-delay-200">
      {/* ══ HERO SEARCH SECTION ════════════════════════════════════════════ */}
      <section className="relative mb-10 overflow-hidden rounded-3xl border border-zinc-100/70 bg-linear-to-br from-zinc-50/90 via-white to-teal-50/70 px-6 py-12 dark:border-zinc-900/30 dark:from-zinc-950/40 dark:via-card dark:to-teal-950/20">
        {/* Decorative background blobs */}
        <div
          aria-hidden
          className="pointer-ideas-none absolute -right-16 -top-16 size-48 rounded-full bg-zinc-300/20 blur-3xl dark:bg-zinc-500/10"
        />
        <div
          aria-hidden
          className="pointer-ideas-none absolute -bottom-16 -left-16 size-48 rounded-full bg-teal-300/20 blur-3xl dark:bg-teal-500/10"
        />
        <div
          aria-hidden
          className="pointer-ideas-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-linear-to-r from-transparent via-zinc-300/60 to-transparent dark:via-zinc-700/40"
        />

        <div className="relative flex flex-col items-center gap-7">
          {/* Brand chip */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-zinc-50 px-3.5 py-1.5 shadow-sm dark:border-zinc-800/50 dark:bg-zinc-950/60">
            <Calendar className="size-3.5 text-zinc-600 dark:text-zinc-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-700 dark:text-zinc-400">
              idea Managment System
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2.5 text-center">
            <h1 className="bg-linear-to-br from-zinc-700 via-zinc-600 to-teal-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent dark:from-zinc-300 dark:via-zinc-400 dark:to-teal-300 sm:text-4xl">
              Manage your ideas, effortlessly.
            </h1>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
              Browse, vote, and get inspired by community-driven sustainability
              solutions from around the world.
            </p>
          </div>

          {/* ── Search input ─────────────────────────────────────────────── */}
          <div className="w-full max-w-xl">
            {/* Outer glow wrapper */}
            <div className="group relative">
              {/* Animated gradient border on focus */}
              <div className="absolute -inset-px rounded-2xl bg-linear-to-r from-zinc-400 via-teal-400 to-zinc-500 opacity-0 blur-sm transition-all duration-300 group-focus-within:opacity-50 dark:group-focus-within:opacity-30" />

              <div className="relative flex items-center">
                {/* Left icon: spinner while fetching, search icon otherwise */}
                <div className="pointer-ideas-none absolute left-4 z-10 transition-colors duration-200 text-muted-foreground group-focus-within:text-zinc-600 dark:group-focus-within:text-zinc-400">
                  {isFetching && isSearching ? (
                    <EcoSpinner size="xs" />
                  ) : (
                    <Search className="size-4" />
                  )}
                </div>

                <AppTooltip
                  side="bottom"
                  delay={600}
                  content={
                    <span className="flex items-center gap-1.5">
                      <Sprout className="size-3.5 shrink-0 text-zinc-300" />
                      Search by title, problem statement, or solution
                    </span>
                  }
                  trigger={
                    <Input
                      ref={searchInputRef}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search ideas — title, solution, or problem…"
                      className={cn(
                        "relative h-13 rounded-2xl border bg-white pl-11 pr-11 text-sm shadow-sm",
                        "placeholder:text-muted-foreground/55",
                        "border-zinc-100 transition-all duration-200",
                        "focus:border-zinc-300 focus:ring-2 focus:ring-zinc-500/20 focus:outline-none",
                        "dark:border-zinc-900/40 dark:bg-card dark:focus:border-zinc-700/60 dark:focus:ring-zinc-600/20",
                      )}
                    />
                  }
                />

                {/* Clear button */}
                {searchText ? (
                  <button
                    type="button"
                    onClick={() => setSearchText("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-full text-muted-foreground transition-all duration-150 hover:bg-zinc-50 hover:text-zinc-600 dark:hover:bg-zinc-900/30 dark:hover:text-zinc-400"
                    aria-label="Clear search"
                  >
                    <X className="size-3.5" />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Search status text */}
            <div className="mt-3 min-h-5 text-center text-sm">
              {debouncedSearch ? (
                <p className="animate-eco-fade-in text-muted-foreground">
                  Showing results for{" "}
                  <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-0.5 font-semibold text-zinc-700 ring-1 ring-zinc-200/60 dark:bg-zinc-900/40 dark:text-zinc-300 dark:ring-zinc-800/40">
                    {debouncedSearch}
                  </span>
                </p>
              ) : (
                <p className="text-muted-foreground/50 text-xs">
                  Type to Event Keywordd
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ BOOKING DETAILS DIALOG ═══════════════════════════════════════ */}
      <Dialog
        open={bookingDetailsDialog.open}
        onOpenChange={(open) =>
          setBookingDetailsDialog((prev) => ({
            ...prev,
            open,
            ...(open ? {} : { data: null, error: "", loading: false }),
          }))
        }
      >
        <DialogContent className="max-w-[calc(100%-1rem)] overflow-hidden p-0 sm:max-w-5xl">
          <div className="bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-800 text-white">
            <DialogHeader className="px-6 pb-4 pt-6 sm:px-8">
              <DialogTitle className="text-2xl font-black tracking-tight sm:text-3xl">
                Booking details
              </DialogTitle>
              <DialogDescription className="text-sm text-white/55">
                {bookingDetailsDialog.ideaTitle}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="max-h-[78vh] overflow-y-auto px-6 py-6 sm:px-8">
            {bookingDetailsDialog.loading ? (
              <div className="flex min-h-64 items-center justify-center rounded-3xl border border-zinc-200 bg-white">
                <div className="flex items-center gap-3 text-zinc-600">
                  <Loader2 className="size-5 animate-spin text-zinc-500" />
                  Loading booking details...
                </div>
              </div>
            ) : bookingDetailsDialog.error ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">
                {bookingDetailsDialog.error}
              </div>
            ) : bookingDetailsDialog.data ? (
              (() => {
                const details =
                  bookingDetailsDialog.data as BookingDetailsPayload;
                const bookings = Array.isArray(details.bookings)
                  ? details.bookings
                  : [];
                const seatConfig = details.seatConfig;

                return (
                  <div className="space-y-6">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                          Total bookings
                        </p>
                        <p className="mt-2 text-3xl font-black text-zinc-900">
                          {details.totalBookings ?? bookings.length}
                        </p>
                      </div>
                      <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                          Total seats
                        </p>
                        <p className="mt-2 text-3xl font-black text-zinc-900">
                          {seatConfig?.totalSeats ?? "-"}
                        </p>
                      </div>
                      <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                          Booked seats
                        </p>
                        <p className="mt-2 text-3xl font-black text-zinc-900">
                          {seatConfig?.bookedSeats ?? "-"}
                        </p>
                      </div>
                      <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                          Available seats
                        </p>
                        <p className="mt-2 text-3xl font-black text-zinc-900">
                          {details.availableSeats ?? "-"}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                        <div className="border-b border-zinc-100 px-5 py-4">
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                            Seat config
                          </p>
                        </div>
                        <div className="grid gap-4 p-5 sm:grid-cols-2">
                          <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-4">
                            <MapPin className="mt-0.5 size-4 text-zinc-500" />
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                                Venue
                              </p>
                              <p className="mt-1 font-semibold text-zinc-800">
                                {seatConfig?.venue || "Not available"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-4">
                            <CalendarDays className="mt-0.5 size-4 text-zinc-500" />
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                                Start time
                              </p>
                              <p className="mt-1 font-semibold text-zinc-800">
                                {safeFormatDateTime(seatConfig?.startTime) ||
                                  "Not available"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-4">
                            <Clock3 className="mt-0.5 size-4 text-zinc-500" />
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                                End time
                              </p>
                              <p className="mt-1 font-semibold text-zinc-800">
                                {safeFormatDateTime(seatConfig?.endTime) ||
                                  "Not available"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-4">
                            <Ticket className="mt-0.5 size-4 text-zinc-500" />
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                                Booking ID
                              </p>
                              <p className="mt-1 font-semibold text-zinc-800">
                                {bookingDetailsDialog.ideaId || "Not available"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                        <div className="border-b border-zinc-100 px-5 py-4">
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                            Booking summary
                          </p>
                        </div>
                        <div className="space-y-3 p-5">
                          <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
                            <span className="text-sm text-zinc-500">idea</span>
                            <span className="max-w-[60%] truncate text-sm font-semibold text-zinc-800">
                              {bookingDetailsDialog.ideaTitle}
                            </span>
                          </div>
                          <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
                            <span className="text-sm text-zinc-500">
                              Status
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-700">
                              <BadgeCheck className="size-3.5" />
                              Loaded
                            </span>
                          </div>
                          <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
                            <span className="text-sm text-zinc-500">
                              Bookings
                            </span>
                            <span className="text-sm font-semibold text-zinc-800">
                              {details.totalBookings ?? bookings.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-zinc-900">
                          Individual bookings
                        </h3>
                        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-500">
                          {bookings.length} record
                          {bookings.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      {bookings.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          {bookings.map((booking) => (
                            <div
                              key={booking.id || booking.bookingCode}
                              className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                                    Booking code
                                  </p>
                                  <p className="mt-1 font-semibold text-zinc-900">
                                    {booking.bookingCode || booking.id || "—"}
                                  </p>
                                </div>
                                <span
                                  className={cn(
                                    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest",
                                    getStatusStyles(booking.status),
                                  )}
                                >
                                  <BadgeCheck className="mr-1.5 size-3.5" />
                                  {booking.status || "Unknown"}
                                </span>
                              </div>

                              <div className="mt-4 grid gap-3 text-sm text-zinc-600">
                                <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-3 py-2">
                                  <span>Seat count</span>
                                  <span className="font-semibold text-zinc-900">
                                    {booking.seatCount ?? "-"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-3 py-2">
                                  <span>User</span>
                                  <span className="max-w-36 truncate font-semibold text-zinc-900">
                                    {booking.userId || "—"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-3 py-2">
                                  <span>Created</span>
                                  <span className="font-semibold text-zinc-900">
                                    {safeFormatDateTime(booking.createdAt) ||
                                      "—"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 text-center text-sm text-zinc-500">
                          No individual booking records were returned for this
                          idea.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* ══ ideaS GRID SECTION ════════════════════════════════════════════ */}
      <div className="mx-auto w-full max-w-6xl px-4 py-2">
        {/* Section header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {isSearching ? "Search Results" : "All Approved ideas"}
            </h2>
            {!showSkeletonGrid && (
              <span className="inline-flex items-center rounded-full bg-zinc-50 px-2.5 py-0.5 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200/60 dark:bg-zinc-900/30 dark:text-zinc-400 dark:ring-zinc-800/50">
                {underReviewideas.length}
              </span>
            )}
          </div>

          {/* {showingRange && !showSkeletonGrid && (
            <p className="text-xs text-muted-foreground">
              {showingRange.start}–{showingRange.end} of {showingRange.total}
            </p>
          )} */}
        </div>

        {/* ── Skeleton grid ─────────────────────────────────────────────── */}
        {showSkeletonGrid && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: limit }, (_, idx) => (
              <EcoCardSkeleton key={`idea-skeleton-${idx}`} />
            ))}
          </div>
        )}

        {/* ── Error state ───────────────────────────────────────────────── */}
        {!showSkeletonGrid && isError && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-3xl border border-red-100 bg-red-50/60 px-6 py-16 text-center dark:border-red-900/30 dark:bg-red-950/20">
            <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="size-7 text-red-500" />
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-semibold text-foreground">
                Something went wrong
              </p>
              <p className="max-w-xs text-sm text-muted-foreground">
                We couldn&apos;t load ideas right now. Please try again.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ["idea", "infinite"],
                })
              }
            >
              Retry
            </Button>
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────────────── */}
        {!showSkeletonGrid && !isError && underReviewideas.length === 0 && (
          <div className="mt-10 flex flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-zinc-200/80 bg-linear-to-b from-zinc-50/60 to-white px-6 py-16 text-center dark:border-zinc-800/30 dark:from-zinc-950/20 dark:to-card">
            {/* Animated icon */}
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-zinc-200/60 animation-duration-[2s] dark:bg-zinc-800/30" />
              <div className="relative inline-flex size-16 items-center justify-center rounded-2xl bg-zinc-100 shadow-inner dark:bg-zinc-900/40">
                {debouncedSearch ? (
                  <Search className="size-7 text-zinc-500" />
                ) : (
                  <Sprout className="size-7 text-zinc-500" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-base font-semibold text-foreground">
                {debouncedSearch ? "No matching ideas" : "No ideas yet"}
              </p>
              <p className="max-w-xs text-sm text-muted-foreground">
                {debouncedSearch
                  ? `We couldn't find any results for "${debouncedSearch}". Try a different keyword.`
                  : "There are no approved ideas to show right now. Check back soon!"}
              </p>
            </div>

            {debouncedSearch && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl border-zinc-200 hover:bg-zinc-50 hover:text-zinc-700 dark:border-zinc-800/60 dark:hover:bg-zinc-900/30 dark:hover:text-zinc-400"
                onClick={() => setSearchText("")}
              >
                <X className="mr-1.5 size-3.5" />
                Clear search
              </Button>
            )}
          </div>
        )}

        {/* ── ideas grid ────────────────────────────────────────────────── */}
        {!showSkeletonGrid && !isError && underReviewideas.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {underReviewideas.map((idea) => {
              const imageUrls = normalizeImageUrls(idea?.images);
              const coverImage = pickImage(imageUrls, 0);
              const authorName =
                idea?.author?.name || idea?.authorName || "Unknown";
              const createdAt = safeFormatDate(idea?.createdAt);
              const purchased = isideaPurchasedByUser(idea, userId);

              return (
                <Fragment key={idea?.id ?? idea?.title ?? createdAt}>
                  {ideaCardShell({
                    coverImage,
                    title: idea?.title || "(Untitled idea)",
                    problemStatement: idea?.problemStatement,
                    authorName,
                    createdAt,
                    category: idea?.category?.name,
                    isPaid: idea?.isPaid,
                    price:
                      typeof idea?.price === "number" ? idea.price : undefined,
                    footer: (
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          className={cn(
                            "h-10 rounded-2xl text-sm font-semibold text-white",
                            purchased
                              ? "bg-neutral-600 hover:bg-neutral-700"
                              : "bg-zinc-600 hover:bg-zinc-700",
                          )}
                          disabled={purchaseMutation.isPending}
                          onClick={() => {
                            if (!idea?.id) return;
                            if (idea?.isPaid) {
                              if (purchased) {
                                router.push("/dashboard/purchesed-idea");
                                return;
                              }
                              purchaseMutation.mutate({ ideaId: idea.id });
                              return;
                            }
                            queryClient.setQueryData(["idea-detail", idea.id], {
                              success: true,
                              message: "ok",
                              data: idea,
                            });
                            router.push(`/idea/${idea.id}`);
                          }}
                        >
                          {idea?.isPaid
                            ? purchased
                              ? "Purchased"
                              : "Unlock"
                            : "See more"}
                        </Button>

                        <Button
                          onClick={() => void loadBookingDetails(idea)}
                          variant="outline"
                          size="sm"
                          className="w-full rounded-2xl border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                          disabled={
                            bookingDetailsDialog.loading &&
                            bookingDetailsDialog.ideaId === idea.id
                          }
                        >
                          {bookingDetailsDialog.loading &&
                          bookingDetailsDialog.ideaId === idea.id ? (
                            <span className="inline-flex items-center gap-2">
                              <Loader2 className="size-3.5 animate-spin" />
                              Loading...
                            </span>
                          ) : (
                            "Get All Bookings"
                          )}
                        </Button>
                      </div>
                    ),
                  })}
                </Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* ══ PAGINATION ════════════════════════════════════════════════════ */}

      {/* ══ ইনফিনিটি স্ক্রল ট্রিগার ═════════════════════════════════ */}
      {!showSkeletonGrid && !isError && underReviewideas.length > 0 && (
        <InfiniteScrollObserver
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
          loadingComponent={
            <div className="flex justify-center py-6">
              <EcoSpinner size="sm" />
              <span className="ml-2 text-sm text-muted-foreground">
                Loading more ideas...
              </span>
            </div>
          }
          className="h-10 w-full"
        />
      )}
      {/* {totalPages > 1 && (
        <div className="mt-10 space-y-3">
          {showingRange && (
            <p className="text-center text-xs text-muted-foreground">
              Showing {showingRange.start}–{showingRange.end} of{" "}
              {showingRange.total} ideas
            </p>
          )}

          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-2xl border bg-card px-2 py-1.5 shadow-sm">
              <Pagination>
                <PaginationContent className="gap-0.5">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      aria-disabled={!canGoPrev}
                      className={cn(
                        "rounded-xl",
                        !canGoPrev && "pointer-ideas-none opacity-40",
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!canGoPrev) return;
                        setPage((p) => Math.max(1, p - 1));
                      }}
                    />
                  </PaginationItem>

                  {paginationItems.map((item, idx) => {
                    if (item === "ellipsis") {
                      return (
                        <PaginationItem key={`ellipsis-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    const pageNumber = item;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={pageNumber === currentPage}
                          className={cn(
                            "rounded-xl transition-all duration-150",
                            pageNumber === currentPage &&
                              "bg-zinc-600 text-white hover:bg-zinc-700 hover:text-white border-zinc-600",
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            if (pageNumber === currentPage) return;
                            setPage(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      aria-disabled={!canGoNext}
                      className={cn(
                        "rounded-xl",
                        !canGoNext && "pointer-ideas-none opacity-40",
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!canGoNext) return;
                        setPage((p) => Math.min(totalPages, p + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ideaManagmentPage;
