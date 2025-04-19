import React from "react";
import Button from "./Button";
import Link from "next/link";
import SignOutButton from "./SignOutButton";
import { Notebook } from "lucide-react";

const Sidebar: React.FC = () => {
  // Logic

  return (
    <div className="w-72 border-r border-gray-300 p-4 flex flex-col justify-between gap-4 h-dvh fixed z-50 bg-white">
      <div>
        <div className="flex items-center gap-1">
          <Notebook className="w-6 h-6 text-primary" />
          <h3>HAGEL</h3>
        </div>

        <Link href="/create/my-courses">
          <Button className="w-full mt-4">My Courses</Button>
        </Link>
        <p className="text-sm text-gray-500 mt-4">
          HAGEL (Human-led, AI-Generated, Expert-approved, Learning system) is a
          platform that allows users to generate mobile-friendly, engaging
          course content using AI. <br></br>
          <br></br>It is a hybrid system that is human-led, AI-generated, and
          expert-approved, ensuring all content is accurate and reliable.{" "}
          <br></br>
          <br></br>The platform is designed to be user-friendly, making it easy
          for anyone to create high-quality courses in a matter of minutes.
        </p>
      </div>

      <SignOutButton />
    </div>
  );
};

export default Sidebar;
