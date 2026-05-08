import RejectedideaPage from "@/components/modules/idea/RejectedIdea";
import { getUserInfo } from "@/services/auth.service";
import React from "react";

const Rejectedidea = async () => {
  const user = await getUserInfo();
  return <RejectedideaPage user={user} />;
};

export default Rejectedidea;
