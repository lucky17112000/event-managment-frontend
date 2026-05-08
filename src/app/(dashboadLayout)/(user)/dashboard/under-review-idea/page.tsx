import IdeaList from "@/components/modules/idea/IdeaList";
import { getUserInfo } from "@/services/auth.service";
import { getidea } from "@/services/idea.services";
// import { getidea } from "@/services/auth.service";
import { QueryClient } from "@tanstack/react-query";
import React from "react";

export const dynamic = "force-dynamic";

const UnderReviewPage = async () => {
  const queryClient = new QueryClient();
  const page = 0;
  const limit = 3;
  try {
    await queryClient.prefetchQuery({
      queryKey: ["idea", page, limit],
      queryFn: () => getidea({ page, limit }),
    });
  } catch (error) {
    console.error("Under review ideas prefetch skipped:", error);
  }

  const user = await getUserInfo().catch(() => ({
    id: "",
    email: "",
    role: "",
    needPasswordChange: false,
  }));
  return <IdeaList user={user} />;
};

export default UnderReviewPage;
