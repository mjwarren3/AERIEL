"use client";
import BottomBar from "@/components/BottomBar";
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="w-full h-dvh flex flex-col relative">
      <div className="w-full h-full rounded-2xl bg-opacity-0 flex">
        <div className="overflow-y-auto w-full">{children}</div>
      </div>
      <div className="block ">
        <BottomBar />
      </div>
    </div>
  );
};

export default DashboardLayout;
