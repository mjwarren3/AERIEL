"use client";

import { useState } from "react";
import { updateSlideService } from "@/app/services/courseService";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { LessonModule } from "@/types/lesson-modules";
import ReactMarkdown from "react-markdown";

type SlideEditorSidebarProps = {
  slide: LessonModule;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
};

export default function SlideEditorSidebar({
  slide,
  isOpen,
  onClose,
  onSave,
}: SlideEditorSidebarProps) {
  const [editingContent, setEditingContent] = useState<LessonModule>(slide);
  const [saving, setSaving] = useState(false);

  const handleContentChange = (field: string, value: string | string[]) => {
    setEditingContent((prev) => ({
      ...(prev as LessonModule),
      content: {
        ...prev.content,
        [field]: value,
      },
    }));
  };

  const handleListChange = (field: string, index: number, value: string) => {
    const updatedList = [...(editingContent.content[field] as string[])];
    updatedList[index] = value;
    handleContentChange(field, updatedList);
  };

  const handleAddToList = (field: string) => {
    const updatedList = [...(editingContent.content[field] as string[]), ""];
    handleContentChange(field, updatedList);
  };

  const handleRemoveFromList = (field: string, index: number) => {
    const updatedList = [...(editingContent.content[field] as string[])];
    updatedList.splice(index, 1);
    handleContentChange(field, updatedList);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSlideService(editingContent);
      onSave();
    } catch (err) {
      console.error("Error saving slide:", err);
    } finally {
      setSaving(false);
    }
  };

  const renderContentEditor = () => {
    return Object.entries(editingContent.content).map(([field, value]) => {
      if (Array.isArray(value)) {
        // Render list editor
        return (
          <div key={field} className="mb-4">
            <label className="block font-semibold capitalize">{field}</label>
            {value.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleListChange(field, index, e.target.value)
                  }
                  className="border p-2 rounded w-full"
                />
                <button
                  onClick={() => handleRemoveFromList(field, index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddToList(field)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Add Item
            </button>
          </div>
        );
      } else if (field === "text") {
        return (
          <div key={field} className="mb-4">
            <label className="block font-semibold capitalize">{field}</label>
            <textarea
              rows={12}
              value={value as string}
              onChange={(e) => handleContentChange(field, e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <h4>Preview</h4>
            <div className="border p-2 rounded space-y-3 bg-gray-100">
              <ReactMarkdown>{value as string}</ReactMarkdown>
            </div>
          </div>
        );
      } else {
        // Render string editor
        return (
          <div key={field} className="mb-4">
            <label className="block font-semibold capitalize">{field}</label>
            <input
              type="text"
              value={value as string}
              onChange={(e) => handleContentChange(field, e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        );
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-0 right-0 h-dvh min-w-[720px] w-2/3 bg-white shadow-lg z-50 flex flex-col"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Edit Slide</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <label className="block font-semibold">Question</label>
              <input
                type="text"
                value={editingContent.question}
                onChange={(e) =>
                  setEditingContent({
                    ...editingContent,
                    question: e.target.value,
                  })
                }
                className="border p-2 rounded w-full"
              />
            </div>
            {renderContentEditor()}
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
