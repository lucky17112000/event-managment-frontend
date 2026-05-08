"use server";
import LandingNavbar from "@/components/shared/LandingNavbar";
import LandingPage from "@/components/shared/LandingPage";
import { getLimitedidea } from "@/services/idea.services";
import { QueryClient } from "@tanstack/react-query";

export default async function Home() {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: ["ideaLimit"],
      queryFn: () => getLimitedidea(),
    });
  } catch (error) {
    console.error("idea prefetch skipped:", error);
  }
  return (
    <div className="min-h-screen gap-6">
      {/* <LandingNavbar /> */}
      <LandingPage />
    </div>
  );
}
