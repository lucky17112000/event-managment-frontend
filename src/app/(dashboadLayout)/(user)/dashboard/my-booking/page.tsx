"use server";
import MyBooking from "@/components/booking/MyBooking";
import { getMyBookingsAction } from "@/services/booking.service";
import { QueryClient } from "@tanstack/react-query";
import React from "react";

const MyBookingPage = async () => {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: ["myBookings"],
      queryFn: getMyBookingsAction,
    });
  } catch (error) {
    console.error("My Booking prefetch skipped:", error);
  }
  return <MyBooking />;
};

export default MyBookingPage;
