"use client";
import Sidebar from "@/components/Sidebar";
import React from "react";

interface CreateLayoutProps {
  children: React.ReactNode;
}

const CreateLayout: React.FC<CreateLayoutProps> = ({ children }) => {
  return (
    <div className="w-full flex">
      <Sidebar />
      <div className="overflow-y-auto w-full">{children}</div>
    </div>
  );
};

export default CreateLayout;
