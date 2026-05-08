"use client";

import { createBookingAction } from "@/services/booking.service";
import { getideaById } from "@/services/idea.services";
import { ICreateBookingPayload } from "@/zod/booking.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ClockIcon,
  MapPinIcon,
  MinusIcon,
  PlusIcon,
  TicketIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── helpers ───────────────────────────────────────────────────────────────────

const fmt = (raw: unknown) => {
  if (!raw) return "—";
  const d = new Date(raw as string);
  if (isNaN(d.getTime())) return String(raw);
  return d.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ── page ──────────────────────────────────────────────────────────────────────

const BookingPage = () => {
  const params = useParams();
  const ideaId = Array.isArray(params.id)
    ? (params.id[0] ?? "")
    : (params.id ?? "");
  const [serverError, setServerError] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  // Fetch idea details
  const { data: ideaRes, isLoading: ideaLoading } = useQuery({
    queryKey: ["idea-detail", ideaId],
    queryFn: () => getideaById(ideaId),
    enabled: !!ideaId,
  });
  console.log("Fetched idea details:", ideaRes);
  const idea = ideaRes?.data;
  const sc = idea?.seatConfig;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ICreateBookingPayload) =>
      createBookingAction(payload),
  });
  console.log("idea ID for booking:", ideaId);

  const form = useForm({
    defaultValues: { ideaId, seatCount: 1 },
    onSubmit: async ({ value }: any) => {
      setServerError(null);
      try {
        const payload = {
          ideaId: value.ideaId,
          seatCount: Number(value.seatCount),
        };
        const result = (await mutateAsync(payload)) as any;
        if (result?.success) {
          // Persist booked ideaId so the ideas list shows "Already Booked"
          try {
            const KEY = "ideaHub_bookedideaIds";
            const existing: string[] = JSON.parse(
              localStorage.getItem(KEY) ?? "[]",
            );
            if (!existing.includes(ideaId)) {
              localStorage.setItem(KEY, JSON.stringify([...existing, ideaId]));
            }
          } catch {}
          toast.success("Booking confirmed!");
          setBooked(true);
          return;
        }
        setServerError(result?.message || "Booking failed. Please try again.");
      } catch (error) {
        setServerError(
          error instanceof Error
            ? error.message
            : "Booking failed. Please try again.",
        );
      }
    },
  });

  // ── Success screen ─────────────────────────────────────────────────────────
  if (booked) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-zinc-900">
            <CheckCircle2Icon className="size-10 text-white" />
          </div>
          <h2 className="mb-2 text-2xl font-black text-black">
            Booking Confirmed!
          </h2>
          <p className="mb-8 text-zinc-500">
            Your seats have been reserved. Check your dashboard for details.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/idea"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              Browse ideas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Top bar ── */}
      <div className="border-b border-zinc-100 bg-white px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/idea"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition hover:text-black"
          >
            <ChevronLeftIcon className="size-4" />
            Back to ideas
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* ── LEFT: idea info ── */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-zinc-600">
                <TicketIcon className="size-3" />
                Book Seats
              </span>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-black sm:text-4xl">
                {ideaLoading ? (
                  <span className="inline-block h-9 w-64 animate-pulse rounded-lg bg-zinc-100" />
                ) : (
                  (idea?.title ?? "idea Booking")
                )}
              </h1>
              {idea?.category?.name && (
                <span className="mt-2 inline-block rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs font-semibold text-zinc-500">
                  {idea.category.name}
                </span>
              )}
            </div>

            {/* idea meta card */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
                idea Details
              </h3>
              {ideaLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-5 w-3/4 animate-pulse rounded-md bg-zinc-200"
                    />
                  ))}
                </div>
              ) : sc ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white border border-zinc-200">
                      <CalendarDaysIcon className="size-4 text-zinc-500" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        Start
                      </p>
                      <p className="font-medium text-zinc-800">
                        {fmt(sc.startTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white border border-zinc-200">
                      <ClockIcon className="size-4 text-zinc-500" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        End
                      </p>
                      <p className="font-medium text-zinc-800">
                        {fmt(sc.endTime)}
                      </p>
                    </div>
                  </div>

                  {sc.venue && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white border border-zinc-200">
                        <MapPinIcon className="size-4 text-zinc-500" />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                          Venue
                        </p>
                        <p className="font-medium text-zinc-800">{sc.venue}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white border border-zinc-200">
                      <UsersIcon className="size-4 text-zinc-500" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        Total Seats
                      </p>
                      <p className="font-medium text-zinc-800">
                        {sc.totalSeats} seats
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-400">
                  No seat configuration found for this idea.
                </p>
              )}
            </div>

            {/* Description preview */}
            {idea?.description && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  About
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600 line-clamp-4">
                  {idea.description}
                </p>
              </div>
            )}
          </div>

          {/* ── RIGHT: booking form ── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-zinc-200 shadow-sm">
              {/* Form header */}
              <div className="bg-black px-6 py-5">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Reserve your spot
                </p>
                <p className="mt-1 text-xl font-black text-white">
                  Select Seats
                </p>
              </div>

              {/* Form body */}
              <div className="bg-white px-6 py-6">
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                  className="space-y-6"
                >
                  {/* Seat count picker */}
                  <form.Field name="seatCount">
                    {(field) => {
                      const err =
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0
                          ? String(field.state.meta.errors[0])
                          : "";
                      const current = Number(field.state.value) || 1;

                      return (
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-zinc-700">
                            Number of Seats
                          </label>

                          {/* +/- stepper */}
                          <div className="flex items-center gap-0 overflow-hidden rounded-xl border border-zinc-200">
                            <button
                              type="button"
                              aria-label="Decrease seats"
                              disabled={current <= 1}
                              onClick={() =>
                                field.handleChange(
                                  Math.max(1, current - 1) as any,
                                )
                              }
                              className="flex h-12 w-12 shrink-0 items-center justify-center border-r border-zinc-200 bg-zinc-50 text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <MinusIcon className="size-4" />
                            </button>

                            <input
                              id={field.name}
                              type="number"
                              min={1}
                              max={sc?.totalSeats ?? 999}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value as any)
                              }
                              aria-invalid={!!err}
                              className={cn(
                                "h-12 w-full border-0 bg-white text-center text-lg font-bold text-black outline-none",
                                "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                              )}
                            />

                            <button
                              type="button"
                              aria-label="Increase seats"
                              disabled={sc ? current >= sc.totalSeats : false}
                              onClick={() =>
                                field.handleChange((current + 1) as any)
                              }
                              className="flex h-12 w-12 shrink-0 items-center justify-center border-l border-zinc-200 bg-zinc-50 text-zinc-600 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <PlusIcon className="size-4" />
                            </button>
                          </div>

                          {err && (
                            <p className="flex items-center gap-1 text-xs text-red-500">
                              {err}
                            </p>
                          )}

                          {sc && (
                            <p className="text-xs text-zinc-400">
                              Max {sc.totalSeats} seats available
                            </p>
                          )}
                        </div>
                      );
                    }}
                  </form.Field>

                  {/* Order summary */}
                  {idea?.price != null && idea.price > 0 && (
                    <form.Subscribe selector={(s) => s.values.seatCount}>
                      {(seatCount) => {
                        const qty = Math.max(1, Number(seatCount) || 1);
                        const total = (idea.price * qty).toFixed(2);
                        return (
                          <div className="space-y-2 rounded-xl bg-zinc-50 p-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-zinc-500">
                                {qty} × ${idea.price.toFixed(2)}
                              </span>
                              <span className="font-semibold text-black">
                                ${total}
                              </span>
                            </div>
                            <div className="h-px bg-zinc-200" />
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-black">
                                Total
                              </span>
                              <span className="text-lg font-black text-black">
                                ${total}
                              </span>
                            </div>
                          </div>
                        );
                      }}
                    </form.Subscribe>
                  )}

                  {/* Server error */}
                  {serverError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {serverError}
                    </div>
                  )}

                  {/* Submit */}
                  <form.Subscribe
                    selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                  >
                    {([canSubmit, isSubmitting]) => (
                      <button
                        type="submit"
                        disabled={!canSubmit || isPending || isSubmitting}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black text-sm font-bold text-white shadow-md transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isPending || isSubmitting ? (
                          <>
                            <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Confirming…
                          </>
                        ) : (
                          <>
                            <TicketIcon className="size-4" />
                            Confirm Booking
                          </>
                        )}
                      </button>
                    )}
                  </form.Subscribe>

                  <p className="text-center text-xs text-zinc-400">
                    Free cancellation up to 24 hours before the idea.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
