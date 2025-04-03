"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "@/components/Button";
import { getClarification } from "@/app/actions/getClarification";
import AnimatedDiv from "./AnimatedDiv";

interface CreateLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  preFilledTopic?: string;
}

export default function CreateLessonModal({
  isOpen,
  onClose,
  preFilledTopic = "",
}: CreateLessonModalProps) {
  const [step, setStep] = useState(0);
  const [courseData, setCourseData] = useState({
    topic: "",
    clarificationQuestion: "",
    clarificationAnswer: "",
    duration: 0,
    level: "",
    modules: [] as string[],
    additionalInfo: "",
  });
  const [messages, setMessages] = useState<
    { sender: "bot" | "user"; text: string }[]
  >([{ sender: "bot", text: "What do you want to learn?" }]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (preFilledTopic) {
      setCourseData((prevData) => ({ ...prevData, topic: preFilledTopic }));
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: preFilledTopic },
        { sender: "bot", text: "How many days do you want to learn this in?" },
      ]);
      setStep(1);
    }
  }, [preFilledTopic]);

  const handleInputChange = <T extends keyof typeof courseData>(
    field: T,
    value: (typeof courseData)[T]
  ) => {
    setCourseData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleUserResponse = async (response: string) => {
    const updatedMessages = [...messages];
    updatedMessages.push({ sender: "user", text: response });

    if (step === 0) {
      handleInputChange("topic", response);
      setMessages(updatedMessages);

      // Set loading state while fetching clarifying question
      setIsLoading(true);

      const clarifyingQuestion = await getClarification(response);
      setCourseData((prevData) => ({
        ...prevData,
        clarificationQuestion: clarifyingQuestion ?? "",
      }));

      // Update messages with the bot's response
      setIsLoading(false);
      updatedMessages.push({ sender: "bot", text: clarifyingQuestion ?? "" });
      setMessages(updatedMessages);

      setStep(0.5); // Wait for user's clarification answer next
      return;
    }

    if (step === 0.5) {
      handleInputChange("clarificationAnswer", response);
      updatedMessages.push({
        sender: "bot",
        text: "How many days do you want to learn this in?",
      });

      setMessages(updatedMessages);
      setStep(1); // Proceed to duration question
      return;
    }

    switch (step) {
      case 1:
        handleInputChange("duration", parseInt(response));
        updatedMessages.push({
          sender: "bot",
          text: "What level do you expect this to be taught at?",
        });
        break;

      case 2:
        handleInputChange("level", response);
        updatedMessages.push({
          sender: "bot",
          text: "What are your preferred learning modules? (Text, Video, Quiz)",
        });
        break;

      case 3:
        handleInputChange(
          "modules",
          response.split(",").map((m) => m.trim())
        );
        updatedMessages.push({
          sender: "bot",
          text: "Anything else you'd like to add?",
        });
        break;

      case 4:
        handleInputChange("additionalInfo", response);
        updatedMessages.push({
          sender: "bot",
          text: "You're all set! Click 'Create Course' to finalize.",
        });
        break;
    }

    setMessages(updatedMessages);
    setStep((prev) => prev + 1);
  };

  const handleCreateCourse = () => {
    console.log("Course Created:", courseData);
    handleClose();
  };

  const handleClose = () => {
    // Reset the conversation and course data
    setStep(0);
    setCourseData({
      topic: "",
      clarificationQuestion: "",
      clarificationAnswer: "",
      duration: 0,
      level: "",
      modules: [],
      additionalInfo: "",
    });
    setMessages([{ sender: "bot", text: "What do you want to learn?" }]);
    onClose();
  };

  const renderInput = () => {
    if (step === 1) {
      return (
        <div className="flex gap-2 mt-4">
          {[7, 14, 30, 90, 365].map((duration) => (
            <button
              key={duration}
              className="px-4 py-2 rounded border bg-gray-200 hover:bg-gray-300"
              onClick={() => handleUserResponse(duration.toString())}
            >
              {duration} days
            </button>
          ))}
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="flex gap-2 mt-4">
          {["Basic", "Standard", "Advanced"].map((level) => (
            <button
              key={level}
              className="px-4 py-2 rounded border bg-gray-200 hover:bg-gray-300"
              onClick={() => handleUserResponse(level)}
            >
              {level}
            </button>
          ))}
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="flex gap-2 mt-4">
          {["Text", "Video", "Quiz"].map((module) => (
            <button
              key={module}
              className={`px-4 py-2 rounded border ${
                courseData.modules.includes(module)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() =>
                handleUserResponse(
                  courseData.modules.includes(module)
                    ? courseData.modules.filter((m) => m !== module).join(", ")
                    : [...courseData.modules, module].join(", ")
                )
              }
            >
              {module}
            </button>
          ))}
        </div>
      );
    }

    if (step === 5) {
      return (
        <Button className="mt-4" onClick={handleCreateCourse}>
          Create Course
        </Button>
      );
    }

    return (
      <div className="mt-4">
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          placeholder="Type your response here..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleUserResponse((e.target as HTMLTextAreaElement).value);
              (e.target as HTMLTextAreaElement).value = "";
            }
          }}
        />
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="h-dvh p-4 flex flex-col justify-between">
        <div className="h-full overflow-y-auto border-b pb-4">
          <AnimatedDiv>
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`mb-4 ${
                  message.sender === "bot" ? "text-left" : "text-right"
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${
                    message.sender === "bot"
                      ? "bg-gray-200 text-black"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left">
                <div className="inline-block px-4 py-2 rounded-lg bg-gray-200 text-black animate-pulse">
                  ...
                </div>
              </div>
            )}
          </AnimatedDiv>
        </div>
        {renderInput()}
      </div>
    </Modal>
  );
}
