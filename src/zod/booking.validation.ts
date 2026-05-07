// export interface IcreateBookingPayload {
//   ideaId: string;
//   seatCount: number;
// }

import z from "zod";

// export interface IUpdateBookingStatusPayload {
//   bookingId: string;
//   status: "ATTENDED" | "NO_SHOW";
// }

// export interface ICreateSeatConfigPayload {
//   ideaId: string;
//   totalSeats: number;
//   startTime: string;
//   endTime: string;
//   venue?: string;
// }

export const createBookingZodSchema = z.object({
  ideaId: z.string().uuid({ message: "Invalid idea ID" }),
  seatCount: z.coerce
    .number()
    .int({ message: "Seat count must be a whole number" })
    .positive({ message: "Seat count must be at least 1" }),
});

export const updateBookingStatusZodSchema = z.object({
  bookingId: z.string().uuid({ message: "Invalid booking ID" }),
  status: z.enum(["ATTENDED", "NO_SHOW"], {
    message: "Status must be either 'ATTENDED' or 'NO_SHOW'",
  }),
});
export const createSeatConfigZodSchema = z.object({
  ideaId: z.string().uuid({ message: "Invalid idea ID" }),
  totalSeats: z
    .number()
    .int()
    .positive({ message: "Total seats must be a positive integer" }),
  startTime: z.string().datetime({ message: "Invalid start time" }),
  endTime: z.string().datetime({ message: "Invalid end time" }),
  venue: z.string().optional(),
});

export type IUpdateBookingStatusPayload = z.infer<
  typeof updateBookingStatusZodSchema
>;

export type ICreateBookingPayload = z.infer<typeof createBookingZodSchema>;

export type ICreateSeatConfigPayload = z.infer<
  typeof createSeatConfigZodSchema
>;
