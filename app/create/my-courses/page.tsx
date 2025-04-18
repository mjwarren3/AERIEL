"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCoursesService } from "@/app/services/courseService";
import { Course } from "@/types/courses";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCoursesService();
        if (!data) {
          setError("Failed to fetch courses.");
        } else {
          setCourses(data);
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!courses || courses.length === 0) {
    return <div>No courses found.</div>;
  }

  return (
    <div className="w-full flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>
      <div className="w-full flex flex-wrap gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-4 border rounded cursor-pointer max-w-72 hover:bg-gray-100"
            onClick={() => router.push(`/create/my-courses/${course.id}`)}
          >
            <h3 className="text-base font-semibold">{course.course_title}</h3>
            <p className="text-sm text-gray-600">{course.course_description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
