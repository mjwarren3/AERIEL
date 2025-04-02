"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Book, Calendar, Search, User } from "lucide-react";
import Link from "next/link";

const BottomBar = () => {
  const pathname = usePathname(); // Get the current path

  const navItems = [
    {
      href: "/app/today",
      icon: Calendar,
      label: "Today",
      color: "text-primary",
    },
    { href: "/app", icon: Book, label: "My Courses", color: "text-primary" },
    {
      href: "/user/team",
      icon: Search,
      label: "Explore",
      color: "text-mediumgreen",
    },
    {
      href: "/user/messages",
      icon: User,
      label: "Profile",
      color: "text-[#7BBBFF]",
    },
  ];

  return (
    <div>
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-xl flex justify-center">
        <div className="bg-white items-center grid grid-cols-4 w-full py-3 border border-gray-400">
          {navItems.map((item) => {
            const isActive =
              item.href === "/app"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex flex-col relative items-center ${
                    isActive ? "" : ""
                  }`}
                >
                  <item.icon
                    className={`w-6 h-6 ${
                      isActive ? item.color : "text-darkgray"
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      isActive ? "text-primary font-semibold" : "text-darkgray"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
