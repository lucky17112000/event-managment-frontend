import Allideas from "@/components/shared/Idea";
import { getidea } from "@/services/idea.services";
import { getUserInfo } from "@/services/auth.service";
// import { getidea } from "@/services/auth.service";
import { QueryClient } from "@tanstack/react-query";
import React from "react";

export const dynamic = "force-dynamic";

const ideaPage = async () => {
  const queryClient = new QueryClient();
  const page = 1;
  const limit = 3;
  try {
    await queryClient.prefetchQuery({
      queryKey: ["idea", page, limit],
      queryFn: () => getidea({ page, limit, status: "APPROVED" }),
    });
  } catch (error) {
    console.error("idea prefetch skipped:", error);
  }

  const user = await getUserInfo().catch(() => ({
    id: "",
    email: "",
    role: "",
    needPasswordChange: false,
  }));
  // const quryClient2 = new QueryClient();
  // // await quryClient2.prefetchQuery({
  // //   queryKey: ["deleteidea"],
  // //   queryFn: deleteidea,
  // // });

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    //   <ideaList />
    // </HydrationBoundary>
    <Allideas user={user} />
  );
};

export default ideaPage;
