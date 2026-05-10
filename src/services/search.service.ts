"use server";

export const searchSuggestions = async ({ q }: { q: string }) => {
  try {
    console.log("[searchSuggestions] Received query:", q);

    // Validate minimum length (>=2 characters)
    if (!q || q.trim().length < 2) {
      console.log("[searchSuggestions] Query too short, returning empty");
      return { suggestions: [] };
    }

    // Get base URL from environment
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      console.error(
        "[searchSuggestions] NEXT_PUBLIC_API_BASE_URL not configured",
      );
      return { suggestions: [] };
    }

    // Build endpoint URL
    const endpoint = new URL(baseUrl);
    if (!endpoint.pathname.includes("/api/v1")) {
      endpoint.pathname = "/api/v1/idea";
    } else {
      endpoint.pathname = endpoint.pathname.replace(/\/$/, "") + "/idea";
    }
    endpoint.searchParams.append("searchTerm", q.trim());
    endpoint.searchParams.append("limit", "10");
    endpoint.searchParams.append("page", "1");

    console.log("[searchSuggestions] Fetching from:", endpoint.toString());

    // Make direct fetch call without httpClient to avoid server action issues
    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log("[searchSuggestions] Response status:", response.status);

    if (!response.ok) {
      console.error(
        "[searchSuggestions] Response not ok:",
        response.statusText,
      );
      return { suggestions: [] };
    }

    const data = await response.json();
    console.log("[searchSuggestions] Response data:", data);

    // Extract suggestions from idea list
    if (data?.data && Array.isArray(data.data)) {
      console.log("[searchSuggestions] Found", data.data.length, "ideas");
      const suggestions = data.data.map((idea: any) => ({
        id: idea.id,
        title: idea.title,
      }));
      console.log("[searchSuggestions] Returning suggestions:", suggestions);
      return { suggestions };
    }

    console.log("[searchSuggestions] No data found");
    return { suggestions: [] };
  } catch (error) {
    console.error("[searchSuggestions] Error:", error);
    return { suggestions: [] };
  }
};
