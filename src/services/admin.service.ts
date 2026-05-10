"use server";
import error from "@/app/error";
import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/api.types";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export type getUserParams = {
  page?: number;
  limit?: number;
  status?: string;
};

export type AdminUserCount = {
  ideas?: number;
  votes?: number;
};

export type AdminUser = {
  id?: string;
  name?: string;
  email?: string;
  status?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  emailVerified?: boolean;
  _count?: AdminUserCount;
};

export const getAllUserByAdmiAction = async (
  params?: getUserParams,
): Promise<ApiResponse<AdminUser[]>> => {
  try {
    const response = await httpClient.get<AdminUser[]>(
      `${API_BASE_URL}/admin/users`,
      { params },
    );
    return response;
  } catch (err: any) {
    console.error("Error fetching users:", err);
    if (err?.status === 429) {
      // ক্লায়েন্ট সাইডে টোস্ট দেখাও
      toast.error(err?.messageFromServer || "Too many requests! Please wait.");
    }
    throw err;
  }
};
export type UpdateUserRolePayload = {
  userId: string;
  role: "ADMIN" | "USER" | string;
};
export const updateUserRoleByAdminAction = async (
  payload: UpdateUserRolePayload,
): Promise<unknown> => {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  if (!payload?.userId) throw new Error("Missing userId");
  if (!payload?.role) throw new Error("Missing role");
  try {
    const url = `${API_BASE_URL}/admin/users/role/${payload.userId}`;
    const response = await httpClient.patch<unknown>(url, {
      role: payload.role,
    });
    return response;
  } catch (err: any) {
    console.error("Error updating user role:", err);
    if (err?.status === 429) {
      // ক্লায়েন্ট সাইডে টোস্ট দেখাও
      toast.error(err?.messageFromServer || "Too many requests! Please wait.");
    }
    throw err;
  }
};

export type DeleteUserByAdminPayload = {
  userId: string;
};
export const deleteUserByAdminAction = async (
  payload: DeleteUserByAdminPayload,
): Promise<unknown> => {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  if (!payload?.userId) throw new Error("Missing userId");
  try {
    const url = `${API_BASE_URL}/admin/users/delete/${payload.userId}`;
    const response = await httpClient.delete<unknown>(url);
    return response;
  } catch (err: any) {
    console.error("Error deleting user:", err);
    if (err?.status === 429) {
      // ক্লায়েন্ট সাইডে টোস্ট দেখাও
      toast.error(err?.messageFromServer || "Too many requests! Please wait.");
    }
    throw err;
  }
};
/*

{
    "success": true,
    "message": "Admin dashboard stats retrieved successfully",
    "data": {
        "totalUsers": 3,
        "totalAdmins": 2,
        "totalEnergyideas": 12,
        "totalPlasticideas": 1,
        "totalTreeideas": 4,
        "totalOthersideas": 2
    }
}
*/

export type AdminDashboardStats = {
  totalUsers?: number;
  totalAdmins?: number;
  totalEnergyideas?: number;
  totalPlasticideas?: number;
  totalTreeideas?: number;
  totalOthersideas?: number;
};
export const getAdminDashboardStatsAction = async (): Promise<
  ApiResponse<AdminDashboardStats>
> => {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  try {
    const response = await httpClient.get<AdminDashboardStats>(
      `${API_BASE_URL}/admin/dashboard/stats`,
    );
    return response;
  } catch (err) {
    console.error("Error fetching admin dashboard stats:", err);
    throw err;
  }
};

// http://localhost:5000/api/v1/admin/users/stats
/*
{
    "success": true,
    "message": "Individual user stats retrieved successfully",
    "data": {
        "totalideas": 8,
        "approvedideas": 4,
        "totalVotes": 0,
        "totalUpVotes": 0,
        "totalDownVotes": 0
    }
}
*/

export type AdminIndividualUserStats = {
  totalideas?: number;
  approvedideas?: number;
  totalVotes?: number;
  totalUpVotes?: number;
  totalDownVotes?: number;
};

export const getAdminIndividualUserStatsAction = async (): Promise<
  ApiResponse<AdminIndividualUserStats>
> => {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  try {
    const response = await httpClient.get<AdminIndividualUserStats>(
      `${API_BASE_URL}/admin/users/stats`,
    );
    return response;
  } catch (err: any) {
    if (err?.status === 429) {
      // ক্লায়েন্ট সাইডে টোস্ট দেখাও
      toast.error(err?.messageFromServer || "Too many requests! Please wait.");
    }
    console.error("Error fetching individual user stats:", err);
    throw err;
  }
};
// localhost:5000/api/v1/booking/8013f109-03a3-4ad0-aad1-08cbb7abd6ba
export const getBookingDetailsByideaIdAction = async (
  ideaId: string,
): Promise<ApiResponse<unknown>> => {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  if (!ideaId) throw new Error("Missing ideaId");
  try {
    const response = await httpClient.get<unknown>(`/booking/${ideaId}`);
    return response;
  } catch (err: any) {
    if (err?.status === 429) {
      // ক্লায়েন্ট সাইডে টোস্ট দেখাও
      toast.error(err?.messageFromServer || "Too many requests! Please wait.");
    }
    console.error("Error fetching booking details:", err);
    const body =
      err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data
        : undefined;
    return {
      success: false,
      message:
        body?.message || "Failed to fetch booking details. Please try again.",
      data: null,
    };
  }
};
