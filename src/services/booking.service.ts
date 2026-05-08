"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { IBookingResponse } from "@/types/booking.type";
import {
  createBookingZodSchema,
  ICreateBookingPayload,
} from "@/zod/booking.validation";

export const createBookingAction = async (
  payload: ICreateBookingPayload,
): Promise<ApiResponse<IBookingResponse>> => {
  const parsePayload = createBookingZodSchema.safeParse(payload);
  if (!parsePayload.success) {
    const message = parsePayload.error.issues[0].message || "Validation error";
    return {
      success: false,
      message,
      data: null as unknown as IBookingResponse,
    };
  }

  try {
    // Use relative path — httpClient's axios instance already has baseURL set
    const response = await httpClient.post<IBookingResponse>(
      "/booking",
      parsePayload.data,
    );
    return response;
  } catch (error: any) {
    // Extract the backend error message from the Axios 4xx/5xx response body
    const body = error?.response?.data;
    const message =
      (Array.isArray(body?.errorSources) && body.errorSources[0]?.message) ||
      body?.message ||
      error?.message ||
      "Booking failed. Please try again.";
    return {
      success: false,
      message,
      data: null as unknown as IBookingResponse,
    };
  }
};
// localhost:5000/api/v1/booking/my-bookings
export const getMyBookingsAction = async (): Promise<ApiResponse<unknown>> => {
  try {
    const response = await httpClient.get<unknown>("/booking/my-bookings");
    return response;
  } catch (error: any) {
    const body = error?.response?.data;
    const message =
      (Array.isArray(body?.errorSources) && body.errorSources[0]?.message) ||
      body?.message ||
      error?.message ||
      "Failed to fetch bookings. Please try again.";
    return { success: false, message, data: [] };
  }
};
