"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCoursesService } from "@/app/services/courseService";
import { Course } from "@/types/courses";
import Button from "@/components/Button";
import NewCourseModal from "@/components/NewCourseModal";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
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

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

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
    <div className="w-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <Button onClick={handleModalOpen}>New Course</Button>
      </div>
      <div className="w-full grid grid-cols-3 gap-4 mt-2">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-4 border rounded-xl border-gray-400 cursor-pointer hover:bg-gray-100"
            onClick={() => router.push(`/create/my-courses/${course.id}`)}
          >
            <h3 className="text-base font-semibold">{course.course_title}</h3>
            <p className="text-sm text-gray-600">{course.course_description}</p>
            <div className="bg-pink-300 inline-flex text-xs font-semibold px-2 py-1 rounded-full mt-2">
              {course.course_category}
            </div>
          </div>
        ))}
      </div>
      <NewCourseModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
}
