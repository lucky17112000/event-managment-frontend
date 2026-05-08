"use client";
import { getMyBookingsAction } from "@/services/booking.service";
import type { IBookingResponse } from "@/types/booking.type";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
  BadgeCheck,
  Layers3,
} from "lucide-react";

const DEFAULT_IMAGE = "/window.svg";

const formatDateTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
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

const BookingCard = ({ booking }: { booking: IBookingResponse }) => {
  const imageSrc = booking.idea?.images?.[0] || DEFAULT_IMAGE;
  const startTime = formatDateTime(booking.seatConfig?.startTime);
  const endTime = formatDateTime(booking.seatConfig?.endTime);
  const statusStyles = getStatusStyles(booking.status);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-zinc-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-900/10 hover:ring-zinc-300">
      <div className="relative h-48 overflow-hidden sm:h-52">
        <img
          src={imageSrc}
          alt={booking.idea?.title || "Booked idea"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE;
          }}
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-md">
            Booking
          </span>
          {booking.bookingCode ? (
            <span className="hidden rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/90 backdrop-blur-md sm:inline-flex">
              {booking.bookingCode}
            </span>
          ) : null}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-white">
          <div className="min-w-0">
            <p className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium backdrop-blur-md">
              <Layers3 className="size-3.5 text-zinc-200" />
              Your Booking
            </p>
            <h3 className="line-clamp-2 text-lg font-bold leading-tight sm:text-xl">
              {booking.idea?.title || "Untitled booking"}
            </h3>
          </div>
          <div className="shrink-0 rounded-2xl bg-white/10 px-3 py-2 text-right backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-widest text-white/60">
              Seats
            </p>
            <p className="text-xl font-black leading-none">
              {booking.seatCount}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-3">
            <div className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-500 shadow-sm ring-1 ring-zinc-200">
              <CalendarDays className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                Start time
              </p>
              <p className="mt-0.5 font-medium text-zinc-700">
                {startTime || "Not available"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-3">
            <div className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-500 shadow-sm ring-1 ring-zinc-200">
              <Clock3 className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                End time
              </p>
              <p className="mt-0.5 font-medium text-zinc-700">
                {endTime || "Not available"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-3 sm:col-span-2">
            <div className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-zinc-500 shadow-sm ring-1 ring-zinc-200">
              <MapPin className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                Venue
              </p>
              <p className="mt-0.5 font-medium text-zinc-700">
                {booking.seatConfig?.venue || "Venue not available"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-widest",
              statusStyles,
            )}
          >
            <BadgeCheck className="size-3.5" />
            {booking.status || "Unknown"}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-600">
            <Ticket className="size-3.5 text-zinc-500" />
            {booking.seatCount} seat{booking.seatCount === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </article>
  );
};

const MyBooking = () => {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["myBookings"],
    queryFn: () => getMyBookingsAction(),
  });

  const bookings = Array.isArray(data?.data)
    ? (data.data as IBookingResponse[])
    : [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
            My bookings
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Booking overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Your confirmed bookings appear as responsive cards with the idea
            image, schedule, venue, status, and seat count.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 shadow-sm">
          <span className="inline-flex size-2 rounded-full bg-zinc-500" />
          {isFetching
            ? "Refreshing..."
            : `${bookings.length} booking${bookings.length === 1 ? "" : "s"}`}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-112 animate-pulse overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
            >
              <div className="h-48 bg-zinc-200" />
              <div className="space-y-4 p-5">
                <div className="h-4 w-2/3 rounded-full bg-zinc-200" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="h-20 rounded-2xl bg-zinc-100" />
                  <div className="h-20 rounded-2xl bg-zinc-100" />
                  <div className="h-20 rounded-2xl bg-zinc-100 sm:col-span-2" />
                </div>
                <div className="h-8 w-48 rounded-full bg-zinc-200" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700 shadow-sm">
          Failed to load your bookings. Please try again.
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-3xl border border-zinc-200 bg-white px-6 py-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-foreground">
            No bookings yet
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Once you book an idea, it will appear here as a card with all the
            important details.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooking;
