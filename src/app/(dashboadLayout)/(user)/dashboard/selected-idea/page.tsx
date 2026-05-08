import SelectedideaPage from "@/components/modules/idea/SelectedIdeaPage";
import { getUserInfo } from "@/services/auth.service";
import React from "react";

const SelectedideaPageComponent = async () => {
  const user = await getUserInfo();
  return <SelectedideaPage user={user} />;
};

export default SelectedideaPageComponent;
