"use client";

import { useState } from "react";
import LessonModal from "@/components/LessonModal";

const days = [
  {
    id: 1,
    title: "Mechanics 101",
    is_complete: true,
  },
  {
    id: 2,
    title: "Mechanics 201",
    is_complete: true,
  },
  {
    id: 3,
    title: "Mechanics 301",
    is_complete: false,
  },
];

export default function PrivatePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full max-w-xl px-4 pt-4">
        <h1>Car Mechanics</h1>
        <div className="grid grid-cols-4 w-full gap-4 mt-8">
          {days.map((course, index) => (
            <div
              key={index}
              className="flex-col gap-1 justify-center items-center"
            >
              <div
                onClick={() => openModal()}
                className="flex justify-center items-center p-4 border rounded-lg border-gray-500 cursor-pointer hover:shadow-sm"
              >
                <h2>{index + 1}</h2>
              </div>
              <p className="text-xs font-light mt-2 text-center">
                {course.title}
              </p>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && <LessonModal isOpen={isModalOpen} onClose={closeModal} />}
    </>
  );
}
