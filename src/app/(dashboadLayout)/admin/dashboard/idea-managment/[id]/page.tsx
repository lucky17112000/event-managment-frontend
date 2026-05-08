"use client";
import { useParams } from "next/navigation";
import React from "react";

const ideaManagmentPage = () => {
  const params = useParams();
  const { id } = params;

  return (
    <div>
      <h1>idea Management Page</h1>
      <p>idea ID: {id}</p>
    </div>
  );
};

export default ideaManagmentPage;
