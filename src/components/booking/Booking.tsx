"use client";
import { createBookingAction } from "@/services/booking.service";
import {
  createBookingZodSchema,
  ICreateBookingPayload,
} from "@/zod/booking.validation";
import { useForm } from "@tanstack/react-form";
import { MutationCache, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import AppField from "../shared/Appfield";
import AppSubmitButton from "../shared/AppSubmitButton";

const Booking = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const { mutateAsync } = useMutation({
    mutationFn: (payload: ICreateBookingPayload) =>
      createBookingAction(payload),
  });

  const form = useForm({
    defaultValues: { ideaId: "", seatCount: 0 },
    onSubmit: async ({ value }) => {
      try {
        const result = (await mutateAsync(value)) as any;
        if (result?.success) {
          // Handle success (e.g., show a success message, redirect, etc.)
          if (!result?.success) {
            setServerError(
              result?.message || "Login failed. Please try again.",
            );
            return;
          }
          toast.success("Booking created successfully!");
        }
        router.push("/dashboard");
      } catch (error) {
        console.error("Login error:", error);
        setServerError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        );
      }
    },
  });
  return (
    <div>
      <form
        method="POST"
        action="#"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="animate-eco-fade-up animate-delay-100">
          <form.Field
            name="seatCount"
            validators={{
              onChange: ({ value }) => {
                const result =
                  createBookingZodSchema.shape.seatCount.safeParse(value);
                return result.success
                  ? undefined
                  : (result.error.issues[0]?.message ?? "Invalid seat count");
              },
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Seat Count"
                type="number"
                placeholder="Enter seat count"
              />
            )}
          </form.Field>

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting}
                disabled={!canSubmit}
                classname="w-full h-11 bg-zinc-600 hover:bg-zinc-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:shadow-zinc-600/20"
              >
                Sign In →
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
};

export default Booking;
