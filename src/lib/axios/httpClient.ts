import { ApiResponse } from "@/types/api.types";
import axios from "axios";
// import { isTokenExpiredSoon } from "../tokenUtiles";
import { cookies, headers } from "next/headers";
import { isTokenExpiredSoon } from "../token.utiles";
import { getNewTokenWithRefreshToken } from "@/services/auth.service";
// import { getNewTokenWithRefreshToken } from "@/services/auth.services";

const getApiBaseUrl = (): string => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }
  return apiBaseUrl;
};

const axiosInstance = async () => {
  const apiBaseUrl = getApiBaseUrl();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (accessToken && refreshToken) {
    await tryRefreshToken(accessToken, refreshToken);
  }

  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (cookieHeader) {
    baseHeaders.Cookie = cookieHeader;
  }
  //eg: cookie: "accessToken=abc123; refreshToken=def456"
  const instance = axios.create({
    baseURL: apiBaseUrl,
    timeout: 30000,
    headers: baseHeaders,
  });

  // ✅ এরর হ্যান্ডলিং ইন্টারসেপ্টর - সব ধরনের এরর ক্যাচ করে
  instance.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      // Axios error check
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data as
          | Record<string, unknown>
          | undefined;

        // রেসপন্স থেকে মেসেজ এক্সট্র্যাক্ট করার ফাংশন
        const extractMessage = (): string => {
          const msg =
            responseData?.message || responseData?.msg || responseData?.error;
          return typeof msg === "string" ? msg : "An error occurred";
        };

        // Rate limit (429)
        if (status === 429) {
          const rateLimitError = new Error("RATE_LIMIT_EXCEEDED");
          (rateLimitError as any).status = 429;
          (rateLimitError as any).isRateLimit = true;
          (rateLimitError as any).originalError = error;
          (rateLimitError as any).message = extractMessage();
          (rateLimitError as any).retryAfter =
            error.response?.headers?.["retry-after"] ||
            error.response?.headers?.["x-ratelimit-reset"] ||
            null;
          return Promise.reject(rateLimitError);
        }

        // Server error (5xx)
        if (status && status >= 500) {
          const serverError = new Error("SERVER_ERROR");
          (serverError as any).status = status;
          (serverError as any).isServerError = true;
          (serverError as any).originalError = error;
          (serverError as any).message = extractMessage();
          return Promise.reject(serverError);
        }

        // Not found (404)
        if (status === 404) {
          const notFoundError = new Error("NOT_FOUND");
          (notFoundError as any).status = 404;
          (notFoundError as any).isNotFound = true;
          (notFoundError as any).originalError = error;
          (notFoundError as any).message = extractMessage();
          return Promise.reject(notFoundError);
        }

        // Bad request (4xx - excluding 404 and 429)
        if (status && status >= 400 && status < 500) {
          const clientError = new Error("CLIENT_ERROR");
          (clientError as any).status = status;
          (clientError as any).isClientError = true;
          (clientError as any).originalError = error;
          (clientError as any).message = extractMessage();
          return Promise.reject(clientError);
        }

        // Network error (no response)
        if (error.message === "Network Error" || !error.response) {
          const networkError = new Error("NETWORK_ERROR");
          (networkError as any).isNetworkError = true;
          (networkError as any).originalError = error;
          (networkError as any).message =
            "Network error. Please check your connection.";
          return Promise.reject(networkError);
        }
      }

      // Unknown error
      const unknownError = new Error("UNKNOWN_ERROR");
      (unknownError as any).isUnknownError = true;
      (unknownError as any).originalError = error;
      return Promise.reject(unknownError);
    },
  );

  return instance;
};

const normalizeHttpError = (
  error: unknown,
  fallbackCode: string,
  fallbackMessage: string,
) => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error : new Error(fallbackMessage);
  }

  const status = error.response?.status;
  const responseData = error.response?.data as
    | Record<string, unknown>
    | undefined;

  const messageFromResponse =
    typeof responseData?.message === "string"
      ? responseData.message
      : typeof responseData?.msg === "string"
        ? responseData.msg
        : typeof responseData?.error === "string"
          ? responseData.error
          : fallbackMessage;

  const normalizedError = new Error(fallbackCode);
  (normalizedError as any).status = status ?? null;
  (normalizedError as any).code = fallbackCode;
  (normalizedError as any).message = messageFromResponse;
  (normalizedError as any).originalError = error;

  if (status === 429) {
    (normalizedError as any).isRateLimit = true;
    (normalizedError as any).retryAfter =
      error.response?.headers?.["retry-after"] ||
      error.response?.headers?.["x-ratelimit-reset"] ||
      null;
  }

  if (status && status >= 500) {
    (normalizedError as any).isServerError = true;
  }

  if (status === 404) {
    (normalizedError as any).isNotFound = true;
  }

  if (
    status &&
    status >= 400 &&
    status < 500 &&
    status !== 404 &&
    status !== 429
  ) {
    (normalizedError as any).isClientError = true;
  }

  if (!error.response || error.message === "Network Error") {
    (normalizedError as any).isNetworkError = true;
  }

  return normalizedError;
};

async function tryRefreshToken(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  if (!(await isTokenExpiredSoon(accessToken))) {
    return;
  }
  const requestHeader = await headers();
  if (requestHeader.get("x-token-refreshed") === "1") {
    return;
  }
  try {
    await getNewTokenWithRefreshToken(refreshToken);
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
}
export interface ApiRequestResponse {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  data?: unknown;
}
const httpGet = async <TData>(
  endpoint: string,
  options?: ApiRequestResponse,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.get<ApiResponse<TData>>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    const normalizedError = normalizeHttpError(
      error,
      "HTTP_GET_FAILED",
      "HTTP GET request failed",
    );
    console.error("HTTP GET request failed:", normalizedError);
    throw normalizedError;
  }
};

//!SECTION for post
const httpPost = async <TData>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestResponse,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    const normalizedError = normalizeHttpError(
      error,
      "HTTP_POST_FAILED",
      "HTTP POST request failed",
    );
    console.error("HTTP POST request failed:", normalizedError);
    throw normalizedError;
  }
};
//!SECTION for put
const httpPut = async <TData>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestResponse,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.put<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    const normalizedError = normalizeHttpError(
      error,
      "HTTP_PUT_FAILED",
      "HTTP PUT request failed",
    );
    console.error("HTTP PUT request failed:", normalizedError);
    throw normalizedError;
  }
};
//!SECTION for delete
const httpDelete = async <TData>(
  endpoint: string,
  options?: ApiRequestResponse,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();

    const response = await instance.delete<ApiResponse<TData>>(endpoint, {
      data: options?.data,
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    const normalizedError = normalizeHttpError(
      error,
      "HTTP_DELETE_FAILED",
      "HTTP DELETE request failed",
    );
    console.error("HTTP DELETE request failed:", normalizedError);
    throw normalizedError;
  }
};
//!SECTION for patch
const httpPatch = async <TData>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestResponse,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    const normalizedError = normalizeHttpError(
      error,
      "HTTP_PATCH_FAILED",
      "HTTP PATCH request failed",
    );
    console.error("HTTP PATCH request failed:", normalizedError);
    throw normalizedError;
  }
};

export const httpClient = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  delete: httpDelete,
  patch: httpPatch,
};
