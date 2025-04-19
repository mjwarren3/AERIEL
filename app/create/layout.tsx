"use client";
import Sidebar from "@/components/Sidebar";
import React from "react";

interface CreateLayoutProps {
  children: React.ReactNode;
}

const CreateLayout: React.FC<CreateLayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 bg-pattern flex justify-center overflow-y-auto min-h-screen ml-72">
        <div className="bg-white p-8 w-full max-w-6xl rounded-lg shadow-xl border-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CreateLayout;
