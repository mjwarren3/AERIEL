"use client";

import Button from "@/components/Button";
import Link from "next/link";
import { useState } from "react";

const initialCourses = [
  {
    id: 1,
    title: "Car Mechanics",
    description: "Learn the basics of car mechanics and maintenance.",
    total_days: 365,
    complete_days: 125,
    streak: 12,
    active: true,
  },
  {
    id: 2,
    title: "Python Programming",
    description: "Learn Python programming from scratch.",
    total_days: 365,
    complete_days: 200,
    streak: 45,
    active: false,
  },
  {
    id: 3,
    title: "Digital Marketing",
    description: "Master digital marketing strategies and techniques.",
    total_days: 30,
    complete_days: 0,
    streak: 5,
    active: true,
  },
];

export default function PrivatePage() {
  const [courses, setCourses] = useState(initialCourses);

  const toggleActive = (id: number) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === id ? { ...course, active: !course.active } : course
      )
    );
  };

  return (
    <div className="w-full px-4 pt-4">
      <h1>Your Courses</h1>
      <div className="grid grid-cols-1 w-full gap-4 mt-8">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-4 border rounded-lg border-gray-500"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{course.title}</h2>
              <label className="flex items-center gap-2">
                <span className="text-sm">
                  {course.active ? "Active" : "Inactive"}
                </span>
                <input
                  type="checkbox"
                  checked={course.active}
                  onChange={() => toggleActive(course.id)}
                  className="cursor-pointer"
                />
              </label>
            </div>
            <p>{course.description}</p>
            <p>Total Days: {course.total_days}</p>
            <p>Completed Days: {course.complete_days}</p>
            <p>Streak: {course.streak} days</p>
            <div className="flex gap-2 mt-2">
              <Link href="/app/course">
                <Button>Course Overview</Button>
              </Link>
              <Button className="bg-green-500">Next Lesson</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
