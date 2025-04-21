"use client";

import React from "react";
import { X } from "lucide-react";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

interface ModalProps extends React.PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (typeof window === "undefined") return null;
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white max-w-lg w-full mx-4 rounded-xl shadow-xl relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-4">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
