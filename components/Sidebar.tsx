import React from "react";
import Link from "next/link";
import SignOutButton from "./SignOutButton";
import { LoaderPinwheel } from "lucide-react";

const Sidebar: React.FC = () => {
  // Logic

  return (
    <div className="w-72 border-r border-gray-300 p-4 flex flex-col justify-between gap-4 h-dvh fixed z-50 bg-white">
      <div>
        <Link
          href="/create/my-courses"
          className="flex items-center gap-1 cursor-pointer"
        >
          <LoaderPinwheel className="w-7 h-7 text-primary text-teal-500" />

          <div className="gradient-text font-sans font-extrabold text-3xl ">
            AERIEL
          </div>
        </Link>

        <Link href="/create/my-courses">
          <button className="w-full mt-4 rounded-lg bg-white hover:bg-gray-100 border-gray-300 border cursor-pointer py-2 font-semibold text-lg">
            My Courses
          </button>
        </Link>
      </div>
      <div>
        <p className="text-sm text-gray-500 mt-4 mb-2">
          AERIEL (AI-generated Expert-reviewed Interactive e-Learning) is a
          platform that allows users to generate mobile-friendly, engaging
          course content using AI. <br></br>
          <br></br>It is a hybrid system that is human-led, AI-generated, and
          expert-approved, ensuring all content is accurate and reliable.{" "}
          <br></br>
          <br></br>The platform is designed to be user-friendly, making it easy
          for anyone to create high-quality courses in a matter of minutes.
        </p>
        <SignOutButton />
      </div>
    </div>
  );
};

export default Sidebar;
