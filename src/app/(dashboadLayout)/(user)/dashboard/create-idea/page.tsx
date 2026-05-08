"use server";
import CreateideaPage from "@/components/modules/idea/CreateIdea";
import { getUserInfo } from "@/services/auth.service";

import React from "react";

const createideaPage = async () => {
  const userInfo = await getUserInfo();
  // console.log("User Info:", userInfo.id);
  return <CreateideaPage id={userInfo.id} />;
};

export default createideaPage;
