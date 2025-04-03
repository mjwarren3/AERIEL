"use client";

import { useState } from "react";
import CreateLessonModal from "@/components/CreateLessonModal";

const categories = [
  {
    title: "Technology",
    courses: ["Python Programming", "Web Development", "AI Basics"],
  },
  {
    title: "Health & Wellness",
    courses: ["Yoga for Beginners", "Healthy Eating", "Meditation Techniques"],
  },
  {
    title: "Business",
    courses: ["Digital Marketing", "Entrepreneurship 101", "Finance Basics"],
  },
  {
    title: "Creative Arts",
    courses: ["Photography Basics", "Painting Techniques", "Creative Writing"],
  },
  {
    title: "Science",
    courses: ["Astronomy 101", "Biology Basics", "Physics for Beginners"],
  },
];

export default function ExplorePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preFilledTopic, setPreFilledTopic] = useState("");

  const handleOpenModal = (topic: string = "") => {
    setPreFilledTopic(topic);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPreFilledTopic("");
  };

  return (
    <div className="w-full px-4 pt-4">
      <h3 className="text-2xl text-center font-bold mb-4">Explore</h3>
      <div className="mb-6">
        <h4 className="text-lg font-semibold pb-2 pt-8 text-center">
          Create Your Own Course
        </h4>
        <input
          type="text"
          placeholder="What do you want to learn?"
          className="w-full border rounded p-2"
          onFocus={() => handleOpenModal()}
        />
      </div>
      {categories.map((category, idx) => (
        <div key={idx} className="mb-6">
          <h5 className="text-xl font-semibold mb-4">{category.title}</h5>
          <div className="flex flex-wrap gap-2">
            {category.courses.map((course, courseIdx) => (
              <div
                key={courseIdx}
                className="rounded-full cursor-pointer bg-green-200 px-3"
                onClick={() => handleOpenModal(course)}
              >
                <h6 className="text-sm font-medium">{course}</h6>
              </div>
            ))}
          </div>
        </div>
      ))}
      <CreateLessonModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        preFilledTopic={preFilledTopic}
      />
    </div>
  );
}
