import React from "react";
import Button from "./Button";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

const Sidebar: React.FC = () => {
  // Logic

  return (
    <div className="w-72 border-r border-gray-300 p-4 flex flex-col gap-4 h-dvh">
      <h3>Clai</h3>

      <Link href="/create/new-course">
        <Button variant="primary" className="w-full">
          Create Course
        </Button>
      </Link>

      <Link href="/create/my-courses">
        <Button className="w-full">My Courses</Button>
      </Link>

      <SignOutButton />
    </div>
  );
};

export default Sidebar;
